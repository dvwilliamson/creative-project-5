<template>
    <div class="recipeFeed  main-section">
        <div>
            <form v-on:submit.prevent="recipe" class="recipeForm">
                <div class="buttonWrap">
                    <button class="primary" type="submit">Create Recipe</button>
                </div>
            </form>
        </div>
        <div v-for="item in recipeFeed" class="item" v-on:click="itemClicked(item)">
            <div class="thumbnail_div">
                <img v-bind:src="item.pic_url" class="thumbnail" alt="" />
            </div>
            <p class="idline">
                <span class="recipeTitle">{{item.name}}</span>
                <span class="time">Estimated Time: 
                    <i>{{ item.hours }} hr. {{item.minutes}} min.</i>
                </span>
                <img v-bind:src="item.url" />
            </p>
        </div>
    </div>
</template>

<script>
 export default {
   name: 'UserFeed',
   data () {
     return {}
   },
   created: function() {
     this.$store.dispatch('getRecipeFeed');
   },
   computed: {
     recipeFeed: function() {
       return this.$store.getters.recipeFeed;
     },
   },
   methods: {
     recipe: function() {
       this.$router.push('/create');
     },
     itemClicked: function(item){
        this.$store.dispatch('getRecipe', {
            id: item.id
        });
        this.$router.push('/view/' + item.id);
     }
   }
 }
</script>

<style scoped>

.thumbnail_div{
    width: 40px;
    height: 40px;
    margin-right:10px;
    float:left;
    overflow: hidden;
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-color: #eee;

    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}

.item:hover{
    background-color: #eee;
}

.thumbnail{
    width: 40px;
    height: 40px;
    object-fit: cover;
}

.recipeFeed {
    width: 600px;
}

.recipeForm {
    background: #eee;
    padding: 10px;
    margin-bottom: 10px;
}

.buttonWrap {
    width: 100%;
    display: flex;
}

button {
    margin-left: auto;
    height: 2em;
    font-size: 0.9em;
}

.item {
    border-bottom: 1px solid #ddd;
    padding: 10px;
}

.recipeTitle {
    margin-top: 0px;
}

.idline {
    margin-bottom: 0px;
}

.user {
    font-weight: bold;
    margin-right: 10px;
}

.handle {
    margin-right: 10px;
    color: #666;
}

.time {
    float: right;
    color: #666;
}

</style>