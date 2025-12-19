
import { PromptTemplate, UserProfile, ExecutionState } from '../types';

const API_BASE_URL = "http://localhost:8000"; // Địa chỉ backend FastAPI của bạn

export const ApiService = {
    //Đồng bộ user với Postgres sau khi login Firebase thành công
    syncUser: async (user: UserProfile) => {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        return response.json();
    },

    getPrompts: async (category?: string, role?: string): Promise<PromptTemplate[]> => {
        let url = `${API_BASE_URL}/prompts/`;
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (role) params.append('role', role);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        return response.json();
    },

    savePrompt: async (prompt: any, userId: string) => {
        const response = await fetch(`${API_BASE_URL}/prompts/?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: prompt.title,
                description: prompt.description,
                content: prompt.content,
                category: prompt.category,
                role_target: prompt.role,
                is_public: true
            })
        });
        return response.json();
    },

    generateAIPrompt: async (userIdea: string) => {
        const response = await fetch(`${API_BASE_URL}/ai/generate-prompt/?user_idea=${encodeURIComponent(userIdea)}`, {
            method: 'POST'
        });
        return response.json();
    }
};
