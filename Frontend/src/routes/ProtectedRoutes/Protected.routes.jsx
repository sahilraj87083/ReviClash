import { Route } from "react-router-dom"
import {
    Dashboard,
    MyProfile,
    Contests,
    LiveContest,
    GroupContestLobby,
    Collections,
    Message,
    CollectionQuestions,
    PrivateContestLobby,
    Questions,
    ContestListPage,
    EditProfile,
    ContestResultPage,
    Leaderboard
} from '../../pages'

import ProtectedLayout from "./ProtectedLayout"

export const ProtectedRoutes = (
    <Route element = {<ProtectedLayout/>}>
        <Route path="/user/dashboard" element = { <Dashboard/> }/>
        <Route path="/user/profile/:username" element = { <MyProfile/> }/>
        <Route path="/user/contests" element = { <Contests/> }/>
        <Route path="/contests/all" element={<ContestListPage type="all" />} />
        <Route path="/contests/created" element={<ContestListPage type="created" />} />
        <Route path="/contests/joined" element={<ContestListPage type="joined" />} />
        <Route path="/contests/:contestId/live" element = { <LiveContest/> }/>
        <Route path="/contests/:contestId/leaderboard" element = { <ContestResultPage/> }/>
        <Route path="/user/contests/public/:contestId" element = { <GroupContestLobby/> }/>
        <Route path="/user/contests/private/:contestId" element = { <PrivateContestLobby/> }/>
        <Route path="/public/leaderboard" element = {<Leaderboard/>} />

        <Route path = "/user/questions" element = {<Questions/>} />
        <Route path="/user/profile/edit" element={<EditProfile />} />

        <Route path="/user/collections" element = { <Collections/> }/>
        <Route path="/user/messages" element = { <Message/> }/>
        <Route path="/user/collections/:collectionId/questions" element={<CollectionQuestions mode="owner" />} />
        <Route path="/collections/:collectionId" element={<CollectionQuestions mode="public" />} />

    </Route>
)