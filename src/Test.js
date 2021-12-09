//页面代码：
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = function () {

    useEffect(() => {
        axios.post('/sxnw', {
            "msg": "GET_TOKEN_REQ",
            "inf": {
                "user": "sxnw",
                "password": "111111"
            }
        }).then(function (res) {
            console.log(res);
        })
    }, [])

    return (
        <h1>获取的IP信息：</h1>
    )
}

export default App