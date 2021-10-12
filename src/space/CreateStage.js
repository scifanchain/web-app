import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';

import StageEditor from './StageEditor';

export default function CreateStage() {
    return (
        <StageEditor submitType='create'/>
    )
}