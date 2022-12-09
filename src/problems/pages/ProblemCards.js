import React, { useState, useEffect } from "react";
import ProblemsCard from "../components/ProblemsCard";
import Loading from "../../loading/Loading";
import styles from "../css/ProblemCards.module.css";

const ProblemCards = () => {
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([]);

    function intersect(a, b) {
        const setB = new Set(b);
        const intersection = [...new Set(a)].filter((x) => setB.has(x));
        return intersection.length;
    }

    const fetchData = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/topics`);
        const data = await res.json();
        const tops = [];
        if (res.status === 200) {
            data.topics.forEach((topic) => {
                tops.push({
                    title: topic.title,
                    problems: topic.problems,
                    unique_link: topic.unique_link,
                    solved: 0,
                });
            });
        }
        const token = localStorage.getItem('usertoken');
        if (token) {
            const userProbs = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/problems/user`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            const userData = await userProbs.json();
            if (userProbs.status === 200) {
                for (let i = 0; i < tops.length; i++) {
                    tops[i].solved = intersect(userData.problems, tops[i].problems);
                }
            }
        }
        setTopics(tops);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <Loading />;
    return (
        <div className="container">
            <div className="small-container">
                <div className={styles["problem-card-container"]}>
                    {topics.map((topic, index) => (
                        <ProblemsCard key={index} topic={topic} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemCards;
