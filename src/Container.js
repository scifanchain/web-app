import React from 'react';
import { Switch, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

import Home from './Home';
import Galaxy from './Galaxy';
import SignIn from './author/SignIn';
import SignUp from './author/SignUp';
import Stage from './works/Stage';
import Finance from './chain/Finance';
import Era from './Era';
import SpaceHome from './space/Home';
import Stars from './Stars';
import Community from './Community';
import WorksHome from './works/Home';
import Expedition from './Expedition';

import BlogHome from './blogs/Home';
import BlogDetail from './blogs/BlogDetail';

export default function Content() {
  return (
    <Switch>
      <Route path='/sign-in' component={SignIn} />
      <Route path='/sign-up' component={SignUp} />
      <Route path='/blogs' component={BlogHome} />
      <Route path='/finance' component={Finance} />
      <Route path='/works' component={WorksHome} />
      <Route path='/galaxy' component={Galaxy} />
      {/* <PrivateRoute path='/space' component={SpaceHome} /> */}
      <Route path='/space' component={SpaceHome} />
      <Route path='/era' component={Era} />
      <Route path='/stars' component={Stars} />
      <Route path='/community' component={Community} />
      <Route path='/expedition' component={Expedition} />
      <Route path='/stage/:stage_id' component={Stage} />
      <Route path='/' exact component={Home} />
      <Route path='/:username' component={SpaceHome} />
      {/* <Route path='/test' exact component={Test} /> */}
    </Switch>
  )
}