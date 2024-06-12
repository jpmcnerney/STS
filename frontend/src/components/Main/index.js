import React, { useState, useEffect } from "react";
import "./index.scss";
import Loader from "react-loaders";
import "loaders.css/loaders.min.css";
import boxesData from '../../data/boxes.json';

const Main = () => {

    const [selectedButtons, setSelectedButtons] = useState({});
    const [buttonStats, setButtonStats] = useState({});
    const [buttonLoading, setButtonLoading] = useState({});
    const [combinedStats, setCombinedStats] = useState({ individualProbabilities: [], combinedProbability: '?' });

    useEffect(() => {
        // Calculate combined probability whenever selectedButtons or buttonStats change
        setCombinedStats(calculateCombinedProbability());
    }, [buttonStats, selectedButtons]);

    const buttonClicked = async (boxTitle, buttonName) => {

        // If the clicked button is already selected, unselect it
        if (selectedButtons[boxTitle] === buttonName) {
            setSelectedButtons(prevState => ({
                ...prevState,
                [boxTitle]: undefined // Unselect the button
            }));

            setButtonStats(prevState => {
                const newStats = { ...prevState[boxTitle] };
                delete newStats[buttonName];
                return {
                    ...prevState,
                    [boxTitle]: newStats
                };
            });

            setButtonLoading(prevState => ({
                ...prevState,
                [boxTitle]: false
            }));

            return;
        }
    
        setSelectedButtons(prevState => ({
          ...prevState,
          [boxTitle]: buttonName
        }));
    
        setButtonLoading(prevState => ({
            ...prevState,
            [boxTitle]: true
        }));
    
        try {
            // Send a request to update click count
            const updateResponse = await fetch('https://4cw5q4i2cy5uge4hzpxenvgley0tqauz.lambda-url.us-east-2.on.aws/updateClickCount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ boxTitle, buttonName })
            });
    
            if (!updateResponse.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    
        try {
            // Send a request to get click stats
            const statsResponse = await fetch(`https://4cw5q4i2cy5uge4hzpxenvgley0tqauz.lambda-url.us-east-2.on.aws/getClickStats?boxTitle=${encodeURIComponent(boxTitle)}&buttonName=${encodeURIComponent(buttonName)}`);
            if (!statsResponse.ok) {
                throw new Error('Network response was not ok');
            }
    
            const statsData = await statsResponse.json();
            setButtonStats(prevState => ({
                ...prevState,
                [boxTitle]: {
                    ...prevState[boxTitle],
                    [buttonName]: statsData.percentage
                }
            }));
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setTimeout(() => {
                setButtonLoading(prevState => ({
                    ...prevState,
                    [boxTitle]: false
                }));
            }, 200);
        }
    };

    const calculateCombinedProbability = () => {
        const probabilities = Object.keys(selectedButtons)
            .map(boxTitle => {
                const buttonName = selectedButtons[boxTitle];
                return buttonStats[boxTitle]?.[buttonName];
            })
            .filter(prob => prob !== undefined);

        if (probabilities.length === 0) {
            return {
                individualProbabilities: [],
                combinedProbability: '?'
            };
        }

        const combinedProbability = probabilities.reduce((acc, prob) => acc * (prob / 100), 1) * 100; // Convert to percentage
        return {
            individualProbabilities: probabilities.map(prob => parseFloat(prob.toFixed(1))),
            combinedProbability: combinedProbability
        };
    };

    // Function to determine number of decimal places based on the size of the combined probability
    const getDecimalPlaces = (num) => {
        if (num < 1) {
            return Math.max(0, Math.ceil(-Math.log10(num)));
        } else {
            return 0;
        }
    };

    const renderBoxes = (boxes) => {
        if (!boxes || !Array.isArray(boxes)) {
            return <div><h1>No boxes data available</h1></div>
        }
    
        return (
                <div className="boxes-container">
                    <div className="header">
                        <p className="header-title">Pick your favorites for each category below!</p>
                        <p className="header-note">Don't see your favorite? Select your second favorite, then visit the <a href="/contact" className="contact-link">Contact page</a> to shoot me a message</p>
                    </div>
                    {boxes.map((box, boxIndex) => (
                        <div className="box" key={boxIndex}>
                            <div className="box-header">
                                <p className="title">{box.title}</p>
                                <p className="selection-label">Selected: {selectedButtons[box.title] || "None"}</p>
                                {selectedButtons[box.title] && (
                                    buttonLoading[box.title] ? (
                                        <div className="loader-container loader-visible">
                                            <Loader type="ball-pulse-sync" active />
                                        </div>
                                    ) : (
                                        <p className="stats-label">{buttonStats[box.title]?.[selectedButtons[box.title]] !== undefined ? `${buttonStats[box.title][selectedButtons[box.title]].toFixed(1).replace('.0', '')}% of users agree!` : '?% of users agree!'}</p>
                                    )
                                )}
                            </div>
                            <div className="buttons-container">
                                <img src={box.cover} className="box-image" alt="Box cover" />
                                {box.buttons.map((button, buttonIndex) => (
                                    <div className="button-box" key={buttonIndex}>
                                        <button
                                            className={`button-image ${selectedButtons[box.title] === button.name ? 'selected' : ''}`}
                                            onClick={() => buttonClicked(box.title, button.name)}
                                        >
                                            <img src={button.icon} className="button-icon" alt="Button icon" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
        );
    };

    const { individualProbabilities, combinedProbability } = combinedStats;

    // Calculate the number of decimal places based on the size of the combinedProbability
    const decimalPlaces = combinedProbability !== '?' ? getDecimalPlaces(combinedProbability / 100) : 2;

    // Calculate the large number for the small talk answers comparison
    let smallTalkComparisonNumber = 1 / (parseFloat(combinedProbability) / 100);
    smallTalkComparisonNumber = Math.round(smallTalkComparisonNumber);

    return (
        <>
            <div className="container main-page">
                <div className="boxes">
                    {renderBoxes(boxesData.boxes)}
                </div>
                <div className="footer">
                    <p className="greeting">Your SmallTalkStatistics:</p>
                    <p className="probability-label">
                        Probability of selections: {individualProbabilities.map((p, index) => `${p}%`).join(' * ')} = {' '}
                        <span className="combined-probability">
                            {combinedProbability !== '?' ? `${combinedProbability.toFixed(decimalPlaces)}%` : '?'}
                        </span>
                    </p>
                    <p className="small-talk-comparison">
                        Approximately 1 in {smallTalkComparisonNumber.toLocaleString()} people will share the exact same SmallTalkStatistics answers as you
                    </p>
                </div>
            </div>
        </>
    );
};

export default Main;
