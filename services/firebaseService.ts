
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy, where, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "./firebaseConfig";
import { PromptTemplate, UserProfile, UserRole } from "../types";

// --- AUTH SERVICE ---
export const AuthService = {
    loginWithGoogle: async (): Promise<UserProfile> => {
        if (!isFirebaseConfigured()) {
            alert(
                "⚠️ CHƯA CẤU HÌNH FIREBASE!\n\n" +
                "Vui lòng mở file 'services/firebaseConfig.ts' và điền thông tin API Key từ Firebase Console của bạn."
            );
            throw new Error("Missing Firebase Configuration");
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            let userProfile: UserProfile;

            if (userSnap.exists()) {
                const data = userSnap.data();
                userProfile = {
                    id: user.uid,
                    name: user.displayName || "Người dùng",
                    email: user.email || "",
                    role: data.role as UserRole || UserRole.STUDENT,
                    avatar: user.photoURL || ""
                };
            } else {
                userProfile = {
                    id: user.uid,
                    name: user.displayName || "Người dùng",
                    email: user.email || "",
                    role: UserRole.STUDENT,
                    avatar: user.photoURL || ""
                };
                await setDoc(userRef, {
                    name: userProfile.name,
                    email: userProfile.email,
                    role: userProfile.role,
                    avatar: userProfile.avatar,
                    createdAt: Date.now()
                });
            }

            return userProfile;
        } catch (error: any) {
            console.error("Lỗi đăng nhập Firebase:", error);
            throw error;
        }
    },

    logout: async () => {
        await signOut(auth);
    }
};

// --- DATA SERVICE (FIRESTORE) ---
export const DataService = {
    getPrompts: async (currentUser: UserProfile): Promise<PromptTemplate[]> => {
        if (!isFirebaseConfigured()) return [];

        try {
            const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            const allPrompts: PromptTemplate[] = [];
            querySnapshot.forEach((doc) => {
                allPrompts.push({ id: doc.id, ...doc.data() } as PromptTemplate);
            });

            return allPrompts.filter(p => 
                p.isPublic === true || p.authorId === currentUser.id
            );
        } catch (error) {
            console.error("Lỗi lấy danh sách prompts:", error);
            return [];
        }
    },

    addPrompt: async (prompt: PromptTemplate): Promise<PromptTemplate> => {
        if (!isFirebaseConfigured()) throw new Error("Chưa cấu hình Firebase");

        try {
            const { id, ...promptData } = prompt;
            const docRef = await addDoc(collection(db, "prompts"), {
                ...promptData,
                likes: 0,
                likedBy: [],
                createdAt: Date.now()
            });
            return { ...prompt, id: docRef.id, likes: 0, likedBy: [] };
        } catch (error) {
            console.error("Lỗi thêm prompt:", error);
            throw error;
        }
    },

    updatePrompt: async (prompt: PromptTemplate, currentUser: UserProfile): Promise<void> => {
        if (!isFirebaseConfigured()) throw new Error("Chưa cấu hình Firebase");

        try {
            const promptRef = doc(db, "prompts", prompt.id);
            // Verify ownership again on client side (security rules should also handle this)
            if (prompt.authorId !== currentUser.id && currentUser.role !== UserRole.TEACHER) {
                 throw new Error("Không có quyền chỉnh sửa.");
            }
            
            const { id, ...promptData } = prompt;
            await updateDoc(promptRef, { ...promptData });
        } catch (error) {
            console.error("Lỗi cập nhật prompt:", error);
            throw error;
        }
    },

    toggleLikePrompt: async (promptId: string, userId: string): Promise<void> => {
        if (!isFirebaseConfigured()) return;

        try {
            const promptRef = doc(db, "prompts", promptId);
            const promptSnap = await getDoc(promptRef);

            if (promptSnap.exists()) {
                const data = promptSnap.data();
                const likedBy = data.likedBy || [];
                let likes = data.likes || 0;

                if (likedBy.includes(userId)) {
                    // Unlike
                    const index = likedBy.indexOf(userId);
                    if (index > -1) {
                        likedBy.splice(index, 1);
                        likes = Math.max(0, likes - 1);
                    }
                } else {
                    // Like
                    likedBy.push(userId);
                    likes++;
                }

                await updateDoc(promptRef, { likes, likedBy });
            }
        } catch (error) {
            console.error("Lỗi like prompt:", error);
            // Non-blocking error for UI
        }
    },

    deletePrompt: async (promptId: string, currentUser: UserProfile): Promise<boolean> => {
        if (!isFirebaseConfigured()) return false;

        try {
            const promptRef = doc(db, "prompts", promptId);
            const promptSnap = await getDoc(promptRef);

            if (!promptSnap.exists()) return false;

            const promptData = promptSnap.data() as PromptTemplate;

            const isOwner = promptData.authorId === currentUser.id;
            const isTeacherMod = currentUser.role === UserRole.TEACHER && promptData.isPublic;

            if (isOwner || isTeacherMod) {
                await deleteDoc(promptRef);
                return true;
            } else {
                throw new Error("Bạn không có quyền xóa prompt này.");
            }
        } catch (error) {
            console.error("Lỗi xóa prompt:", error);
            throw error;
        }
    }
};
