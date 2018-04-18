
<template>
    <div class='main-section'>
        <div v-if="loggedIn">
            <user-feed/>
        </div>
        <div v-else>
            <welcome-page/>
        </div>
    </div>
</template>

<script>
import WelcomePage from './WelcomePage';
import UserFeed from './UserFeed';
export default {
    name: 'HomePage',
    components: {
        WelcomePage,
        UserFeed
    },
    computed: {
        loggedIn: function(){
            return this.$store.getters.loggedIn;
        }
    }
}
</script>

<style scoped>
.main-section {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}
</style>