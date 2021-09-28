import jwtDecode from 'jwt-decode';
import { checkHttpStatus, parseJSON } from '../../application/utils/utils';
import { pushState } from 'redux-router';
import {LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER} from '../../application/common/constants';

export function loginUserRequest() {
    return {
      type: LOGIN_USER_REQUEST
    }
}

export function loginUserSuccess(data) {
    localStorage.setItem('access_token', data.tokens.accessToken);
    localStorage.setItem('refresh_token', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return {
      type: LOGIN_USER_SUCCESS,
      payload: {
        token: data.tokens.accessToken
      }
    }
}

export function loginUserFailure(error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return {
      type: LOGIN_USER_FAILURE,
      payload: {
        status: error.response.status,
        statusText: error.response.statusText
      }
    }
}

export function getUser() {
    return localStorage.getItem('user')
}

export function loginUser(email, password, redirect="/"){
    return function(dispatch) {
        dispatch(loginUserRequest());
        return fetch('http://localhost:3000/auth/login', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({email: email, password: password})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess(response));
                    dispatch(pushState(null, redirect));
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })
    }
}

export function refreshToken(refreshToken, redirect="/"){
    return function(dispatch) {
        dispatch(loginUserRequest());
        const token = localStorage.getItem('access_token');
        return fetch('http://localhost:3000//auth/refresh-token', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
                body: JSON.stringify({refreshToken})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(storeData(response));
                    dispatch(pushState(null, redirect));
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })
    }
}

export function storeData(data) {
    localStorage.setItem('access_token', data.tokens.accessToken);
    localStorage.setItem('refresh_token', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
}

export function isAuthenticated(){
    const tokens = this.getTokens();

    if (!tokens.accessToken) {
      return false;
    }

    const payload = jwtDecode(tokens.accessToken)

    const expiration = new Date(payload.exp);
    const now = new Date();
    const fiveMinutes = 1000 * 60 * 5;

    if( expiration.getTime() - now.getTime() < fiveMinutes ){
        return true
    } else {
        return false;
    }
}

export function getTokens(){
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    return { accessToken, refreshToken };
}

export function logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return {
        type: LOGOUT_USER
    }
    
} 