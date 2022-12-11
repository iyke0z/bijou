<template>
  <div class="card card-stats">
    <div class="card-body">
      <div class="row">

        <div class="col-12 col-md-12">
            <div>
            <center>
              <h3><b>{{smallTitle}}</b></h3>
              <p class="card-title"><h3>&#8358; {{title.toLocaleString()}}</h3></p></center>
            </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <hr/>
      <slot name="footer"></slot>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'stats-card',
    props:{
      type: {
        type: String,
        description: 'Card text type (primary|info|danger|default|warning|success)'
      },
      title: {
        type: String,
        description: 'Card title'
      },
      smallTitle: {
        type: String,
        description: 'Card small title'
      },
      icon: {
        type: String,
        description: 'Card icon'
      }
    }
  }

</script>
<style scoped>
  .card-content{
    min-height: 85px
  }
</style>
