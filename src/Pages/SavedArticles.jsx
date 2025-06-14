import React, { useEffect, useState, useContext } from "react";
import { getSavedArticles, updateArticleTags, unsaveArticle } from "../Api.js";
import NavBar from "../components/NavBar.jsx";
import WikiCard from "../components/WikiCard.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const Bookmarked = () => {
    const [savedArticles, setSavedArticles] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchSavedArticles = async () => {
            try {
                const articles = await getSavedArticles(token);
                setSavedArticles(articles.map(article => ({ 
                    ...article, 
                    isSaved: true,
                    tags: article.tags || [],
                    isAddingTag: false,
                    newTag: ''
                })));
            } catch (error) {
                console.error("Error fetching saved articles:", error);
            }
        };

        fetchSavedArticles();
    }, [token]);

    const handleSaveToggle = async (article) => {
        try {
            await unsaveArticle(article.url, token);
            setSavedArticles(prevArticles => 
                prevArticles.filter(a => a.url !== article.url)
            );
        } catch (error) {
            console.error("Error unsaving article:", error);
        }
    };

    const handleAddTagClick = (articleUrl) => {
        setSavedArticles(prevArticles =>
            prevArticles.map(article =>
                article.url === articleUrl ? { ...article, isAddingTag: true } : article
            )
        );
    };

    const handleNewTagChange = (event, articleUrl) => {
        setSavedArticles(prevArticles =>
            prevArticles.map(article =>
                article.url === articleUrl ? { ...article, newTag: event.target.value } : article
            )
        );
    };

    const handleAddTag = async (articleUrl) => {
        const article = savedArticles.find(a => a.url === articleUrl);
        if (!article || !article.newTag.trim()) return;

        try {
            const currentTags = article.tags.map(tag => tag.tag_name);
            const newTags = [...currentTags, article.newTag.trim()];
            await updateArticleTags(articleUrl, newTags, token);
            
            setSavedArticles(prevArticles =>
                prevArticles.map(article =>
                    article.url === articleUrl 
                        ? { 
                            ...article, 
                            tags: [...article.tags, { tag_name: article.newTag.trim() }],
                            isAddingTag: false,
                            newTag: ''
                        } 
                        : article
                )
            );
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };

    const handleDeleteTag = async (articleUrl, tagToDelete) => {
        try {
            const article = savedArticles.find(a => a.url === articleUrl);
            const updatedTags = article.tags
                .filter(tag => tag.tag_name !== tagToDelete)
                .map(tag => tag.tag_name);
            
            await updateArticleTags(articleUrl, updatedTags, token);
            
            setSavedArticles(prevArticles =>
                prevArticles.map(article =>
                    article.url === articleUrl 
                        ? { 
                            ...article, 
                            tags: article.tags.filter(tag => tag.tag_name !== tagToDelete)
                        } 
                        : article
                )
            );
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    return (
        <div className="bookmarked-page">
            <NavBar />
            {savedArticles.length === 0 ? (
                <div className="wiki-search-result">
                    <p>No bookmarked articles yet.</p>
                </div>
            ) : (
                <div className="wiki-search-result">
                    {savedArticles.map((article) => (
                        <div key={article.url} className="saved-article-container">
                            <WikiCard
                                wikiarticle={article}
                                onSaveToggle={handleSaveToggle}
                                isSaved={article.isSaved}
                            />
                            <div className="tags-container">
                                <div className="tags-header">
                                    <h3>Tags</h3>
                                    <button 
                                        className="add-tag-button"
                                        onClick={() => handleAddTagClick(article.url)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Add Tag
                                    </button>
                                </div>
                                <div className="tags-list">
                                    {article.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag.tag_name}
                                            <button 
                                                className="delete-tag-button"
                                                onClick={() => handleDeleteTag(article.url, tag.tag_name)}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                {article.isAddingTag && (
                                    <div className="add-tag-form">
                                        <input
                                            type="text"
                                            value={article.newTag}
                                            onChange={(e) => handleNewTagChange(e, article.url)}
                                            placeholder="Enter new tag"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag(article.url)}
                                        />
                                        <button onClick={() => handleAddTag(article.url)}>Add</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarked;