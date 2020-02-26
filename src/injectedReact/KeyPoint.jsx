import React, { useState } from 'react';
import { Image, Button } from 'react-bootstrap';

export default function KeyPoint(props) {
    const [isLoading, setLoading] = useState(false);

    const handleClick = () => {
        console.log('masuk handle');
        props.openSummarize()
        console.log('masuk handle');
        setLoading(true)
        setTimeout(function () {
            setLoading(false)
            window.close()
        }, 2000)
    }

    return (
        <div style={{ width: '100%', textAlign: 'center' }} >
            <Image src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/230/2684580230_e2a7c7d7-20fc-4bac-87ae-38f786d5dff4.png?cb=1582341564" alt="" style={{ width: '60%', marginTop: 15 }} />
            <br /><hr />
            <div className="w-100 d-flex align-items-center flex-column">
                <Button
                    variant="outline-dark"
                    className="w-75"
                    disabled={isLoading}
                    onClick={handleClick}
                    block
                >
                    Summarize this article!
                </Button>
                <Button variant="outline-dark" className="w-75 my-3" block onClick={props.userLogOut}>
                    Logout
                </Button>
            </div>
        </div>
    )
}