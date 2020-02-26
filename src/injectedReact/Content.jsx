import React from 'react';

export default function Content(props) {

    return (
        <>
            {
                props.mode === 'o'
                    ? (
                        <p>{props.article.content}</p>
                    )
                    : props.loadSum
                        ? props.loadingMsg + '...'
                        : props.mode === 's'
                            ? (
                                <p>
                                    <select id="summary-length" value={props.summaryLength} onChange={e => props.setSummaryLength(e.target.value)}>
                                        <option value="s">Short</option>
                                        <option value="m">Medium</option>
                                        <option value="l">Long</option>
                                    </select>
                                    <ul>
                                        {
                                            props.summaryArr.map((p, i) => {
                                                if (i <= sentencesToDisplay(props.summaryLength, props.summaryArr.length)) {
                                                    return <li>{p}</li>;
                                                }
                                            })
                                        }
                                    </ul>
                                </p>
                            )
                            : props.mode === 'r'
                                ? (
                                    <p>
                                        {
                                            props.redactedArr.map((p) => {
                                                return p + ' ';
                                            })
                                        }
                                    </p>
                                )
                                : ''
            }
        </>
    )
}