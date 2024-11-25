<template>
  <div class="table-responsive">
    <div class="card ">
      <div class="card-header">
        <!-- <h4 class="card-title">Full Screen Map</h4> -->
      </div>
      <div id="map" style="width:175%; height:400px"></div>
    </div>
  </div>
</template>
<script>
import { API_KEY } from "./API_KEY";
import { Loader, LoaderOptions } from "google-maps";

const loader = new Loader(API_KEY);

  export default {
    mounted () {
      loader.load().then(function(google) {
        // Regular Map
        var myLatlng = new window.google.maps.LatLng(9.0811, 7.4987)
        var mapOptions = {
          zoom: 20,
          center: myLatlng,
          scrollwheel: true // we disable de scroll over the map, it is a really annoing when you scroll through page
        }

        var map = new window.google.maps.Map(document.getElementById('map'), mapOptions)

        var marker = new window.google.maps.Marker({
          position: myLatlng,
          title: 'Regular Map!'
        })

        marker.setMap(map)
      });
    }
  }
</script>
<style>
</style>
