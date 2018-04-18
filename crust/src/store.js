import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        loggedIn: false,
        loginError: '',
        registerError: '',
        recipeFeed: [],
        recipe: {}
    },
    getters: {
        user: state => state.user,
        loggedIn: state => state.loggedIn,
        loginError: state => state.loginError,
        registerError: state => state.registerError,
        recipeFeed: state => state.recipeFeed,
        recipe: state => state.recipe
    },
    mutations: {
        setUser (state, user){
            state.user = user;
        },
        setLogin(state, status){
            state.loggedIn = status;
        },
        setLoginError(state, message){
            state.loginError = message;
        },
        setRegisterError(state, message){
            state.registerError = message;
        },
        setRecipeFeed(state, recipeFeed){
            state.recipeFeed = recipeFeed;
        },
        setRecipe(state, recipe){
            state.recipe = recipe;
        }
    },
    actions: {
        // Registration, Login //
        register(context, user){
            axios.post('/api/users', user).then(response => {
                context.commit('setUser', response.data.user);
                context.commit('setLogin', true);
                context.commit('setRegisterError', '');
                context.commit('setLoginError', '');
            }).catch(error => {
                context.commit('setLoginError', '');
                context.commit('setLogin', false);
                if (error.response){
                    if (error.response.status === 403)
                        context.commit('setRegisterError', 'That email address already has an account associated with it.');
                    else if (error.response.status === 409)
                        context.commit('setRegisterError', 'That username is already associated with a different account.');
                    return;
                }
                context.commit('setRegisterError', 'Sorry, your request failed. We will look into it.');
            });
        },
        login(context, user){
            axios.post('/api/login', user).then(response => {
                context.commit('setUser', response.data.user);
                context.commit('setLogin', true);
                context.commit('setRegisterError', '');
                context.commit('setLoginError', '');
            }).catch(error => {
                context.commit('setRegisterError', '');
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setLoginError', 'Invalid login.');
                    context.commit('setRegisterError', '');
                    return;
                }
                context.commit('setLoginError', 'Sorry, your request failed. We will look into it.')
            });
        },
        logout(context, user){
            context.commit('setUser', {});
            context.commit('setLogin', false);
        },

        // Recipeeing //
        getRecipeFeed(context){
            axios.get('/api/users/' + context.state.user.id + '/recipes').then(response => {
                context.commit('setRecipeFeed', response.data.recipes);
            }).catch(err => {
                console.log('getFeed failed:', err);
            });
        },
        getRecipe(context, rec){
            console.log("Entering get reip");
            console.log(rec);
            axios.get('/api/recipes/' + rec.id).then(response => {
                console.log(response);
                context.commit('setRecipe', response.data.recipes[0]);
            }).catch(err => {
                console.log('getRecipe failed:', err);
            });
        },
        addRecipe(context, recipe){
            axios.post('/api/users/' + context.state.user.id + '/recipes', recipe).then(response => {
                return context.dispatch('getRecipeFeed');
            }).catch(err => {
                console.log('addRecipe failed:', err);
            });
        },
        updateRecipe(context, recipe){
            console.log(context.state.recipe);
            recipe['id'] = context.state.recipe.id
            axios.put('/api/recipes/' + context.state.recipe.id, recipe).then(response => {
                context.commit('setRecipe', recipe);
            }).catch(err => {
                console.log('addRecipe failed:', err);
            });
        },
        deleteRecipe(context){
            axios.delete('/api/recipes/' + context.state.recipe.id).catch(err => {
                console.log('deleteRecipe failed', err);
            });
        }
    }
});
