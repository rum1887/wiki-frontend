import React, { useState, useEffect, useContext } from "react";
import WikiCard from "../components/WikiCard.jsx";
import { fetchSearchResults, saveArticle, unsaveArticle, getSavedArticles } from "../Api.js";
import NavBar from "../components/NavBar.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Home = () => {
    const { user, token } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [prevSearchTerm, setPrevSearchTerm] = useState("");
    const [results, setResults] = useState(() => {
        if (user?.username) {
            const stored = localStorage.getItem(`searchResults_${user.username}`);
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [savedArticles, setSavedArticles] = useState(() => {
        if (user?.username) {
            const stored = localStorage.getItem(`savedArticles_${user.username}`);
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    // Fetch saved articles on component mount and when user/token changes
    useEffect(() => {
        if (!user || !token) return;

        const fetchSavedArticles = async () => {
            try {
                const articles = await getSavedArticles(token);
                setSavedArticles(articles);
                localStorage.setItem(`savedArticles_${user.username}`, JSON.stringify(articles));

                // Update results with saved state
                setResults(prev => {
                    const updated = prev.map(item => ({
                        ...item,
                        isSaved: articles.some(a => a.url === item.url)
                    }));
                    localStorage.setItem(`searchResults_${user.username}`, JSON.stringify(updated));
                    return updated;
                });
            } catch (err) {
                console.error("Error fetching saved articles:", err);
            }
        };

        fetchSavedArticles();
    }, [user, token]);

    // Save state to localStorage when it changes
    useEffect(() => {
        if (user?.username) {
            localStorage.setItem(`savedArticles_${user.username}`, JSON.stringify(savedArticles));
            localStorage.setItem(`searchResults_${user.username}`, JSON.stringify(results));
        }
    }, [savedArticles, results, user]);

    const handleSaveToggle = async (article) => {
        if (!user || !token) {
            console.error("User is not authenticated!");
            return;
        }

        const isAlreadySaved = savedArticles.some((a) => a.url === article.url);

        try {
            if (isAlreadySaved) {
                await unsaveArticle(article.url, token);
                setSavedArticles(prev => prev.filter(a => a.url !== article.url));
            } else {
                await saveArticle(article, token);
                setSavedArticles(prev => [...prev, { ...article, isSaved: true }]);
            }

            setResults(prev =>
                prev.map(item =>
                    item.url === article.url ? { ...item, isSaved: !isAlreadySaved } : item
                )
            );
        } catch (err) {
            console.error("Error toggling bookmark:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || searchTerm.trim() === "" || searchTerm === prevSearchTerm) return;

        setPrevSearchTerm(searchTerm);

        try {
            const data = await fetchSearchResults(searchTerm, token);
            const enriched = data.map((item) => ({
                ...item,
                isSaved: savedArticles.some((a) => a.url === item.url),
            }));
            setResults(enriched);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="home">
            <NavBar />
            <div className="search-wrapper">
                <form onSubmit={handleSubmit} className="search-container">
                    <input
                        type="text"
                        placeholder="Search Wikipedia"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>
            {results.length > 0 && (
                <div className="wiki-search-result">
                    {results.map((wikiarticle) => (
                        <WikiCard
                            key={wikiarticle.url}
                            wikiarticle={wikiarticle}
                            onSaveToggle={handleSaveToggle}
                            isSaved={wikiarticle.isSaved}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
