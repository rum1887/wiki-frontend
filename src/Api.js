import axios from 'axios';

const API_URL = 'http://localhost:8000';

const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams();
        for (const key in credentials) {
            params.append(key, credentials[key]);
        }

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;  // ✅ Ensure response is returned
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message); 
        throw error;
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/auth/user/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        throw error;
    }
};

const fetchSearchResults = async (searchTerm, token) => {
    try {
        const response = await axios.get(`${API_URL}/search_wiki`, { 
            params: { query: searchTerm },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching search results:", error);
        throw error;
    }
};

const saveArticle = async (article, token) => {
    try {
        console.log("saveArticle called!");
        console.log("Token being sent:", token);

        const response = await fetch(`${API_URL}/save_article`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(article),  
        });

        if (!response.ok) {
            throw new Error("Failed to save article");
        }

        const data = await response.json();
        article.id = data.article_id; 

        return data;
    } catch (error) {
        console.error("Error saving article:", error);
        return null;
    }
};

const unsaveArticle = async (articleUrl, token) => {
    try {
        console.log("unsaveArticle called!");
        console.log(articleUrl)

        const response = await axios.delete(`${API_URL}/unsave_article`, {
            params: { article_url: articleUrl },  
            headers: { "Authorization": `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error unsaving article:", error.response?.data || error.message);
        return null;
    }
};

const getSavedArticles = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/get_saved_articles`, {
            headers: { "Authorization": `Bearer ${token}` } 
        });

        return response.data.map(article => ({
            ...article,
            tags: article.tags.map(tag => ({ tag_name: tag.tag_name }))
        }));
    } catch (error) {
        console.error("Error fetching saved articles:", error.response?.data || error.message);
        return [];
    }
};

const updateArticleTags = async (articleUrl, tags, token) => {
    try {
        const response = await fetch(`${API_URL}/update_tags`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                article_url: articleUrl,
                tags: tags 
            }),  
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to update tags");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating tags:", error.message);
        return null;
    }
};

export { loginUser, registerUser, fetchUserProfile, fetchSearchResults, saveArticle, unsaveArticle, getSavedArticles, updateArticleTags };