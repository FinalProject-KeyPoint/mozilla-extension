import React, { useState } from 'react';
import { Tabs, Slider, Icon } from 'antd';

const { TabPane } = Tabs;

export default function Content(props) {
    const [value, setValue] = useState(0)
    const formatter = (value) => {
        // return `${value}%`;
        if (value == 0) return 'short'
        else if (value == 1) return 'medium'
        else return 'long'
    }
    return (
        <>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Original" key="1">
                    <p>{props.article.content}</p>
                </TabPane>
                <TabPane tab="Reducted" key="3">
                    {
                        props.loadSum
                            ? props.loadingMsg + '...'
                            : <p>
                                {
                                    props.redactedArr.map((p) => {
                                        return p + ' ';
                                    })
                                }
                            </p>
                    }
                </TabPane>
                <TabPane tab="KeyPoint" key="2">
                    <p>
                        <div className="w-100 px-auto" style={{ paddingLeft: 30, paddingRight: 30 }} >
                            <Slider
                                min={0} max={2}
                                tipFormatter={formatter}
                                onChange={value => {
                                    setValue(value)
                                    props.setSummaryLength(value)
                                }} value={value} />
                        </div>
                        {/* <select id="summary-length" value={props.summaryLength} onChange={e => props.setSummaryLength(e.target.value)}>
                            <option value="s">Short</option>
                            <option value="m">Medium</option>
                            <option value="l">Long</option>
                        </select> */}
                        <ul>
                            {
                                props.summaryArr.map((p, i) => {
                                    if (i <= props.sentencesToDisplay(props.summaryLength, props.summaryArr.length)) {
                                        return <li>{p}</li>;
                                    }
                                })
                            }
                        </ul>
                    </p>
                </TabPane>
            </Tabs>
            {/* {
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
                                                if (i <= props.sentencesToDisplay(props.summaryLength, props.summaryArr.length)) {
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
            } */}
        </>
    )
}