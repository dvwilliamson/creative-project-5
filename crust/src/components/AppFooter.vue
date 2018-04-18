<template>
  <nav>
    <hr class="hr-style">
    <ul id="footer">
      <li><img src="/static/images/git_logo.svg"/></li>
      <li><a target="_blank" href="https://github.com/dvwilliamson/creative-project-5">Github</a></li>
    </ul>
  </nav>
</template>

<script>
 export default {
   name: 'Footer',
   data () {
     return {
       email: '',
       password: '',
     }
   },
   computed: {
     user: function() {
       return this.$store.getters.user;
     },
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
     loginError: function() {
       return this.$store.getters.loginError;
     },
   },
   methods: {
     login: function() {
       this.$store.dispatch('login',{
         email: this.email,
         password: this.password,
       }).then(user => {
     this.email = '';
     this.password = '';
       });
     },
     logout: function() {
       this.$store.dispatch('logout');
     }
   }
 }
</script>


<style scoped>
 /* Strip the ul of padding and list styling */
 nav {
     display: grid;
     margin-bottom: 20px;
     margin-top: 50px;
 }

 .hr-style{
    border-style: solid;
    border-color: #eee;
    width: 100%;
    float: left;
 }

 a {
    text-decoration: none;
 }

 ul {
     text-align: center;
     list-style-type:none;
     margin:0;
     padding:0;
 }
 /* Create a horizontal list with spacing */
 li {
     display:inline-block;
     float: left;
     margin-right: 20px;
     height: 50px;
     text-align: center;
     line-height: 50px;
     color: #666;
 }
 /*Active color*/
 li a.active {
 }
 /*Hover state for top level links*/
 li:hover a {
 }
 .right {
     float: right;
 }
 .errorPlace {
     height: 20px;
 }
 img {
     width: 50px;
 }
</style>