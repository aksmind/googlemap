import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader, LatLng } from '@agm/core';
//import 'rxjs/add/operator/map';
import {} from 'googlemaps';
//import { Stats } from 'fs';
//import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent /*implements OnInit*/{

  title = 'Google Map Integration';
  // lat: number = 51.678418;
  // lng: number = 7.809007;
  locationChosen = false;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  //public latlng: LatLng;

  @ViewChild('search') 
  public searchElementRef: ElementRef;
  // maps: google.maps.Map;

  constructor(private mapsApiLoader: MapsAPILoader,private ngZone: NgZone){}

  ngOnInit(){
    //google maps default
    this.zoom = 4;
    this.latitude = 339.8282;
    this.longitude = -98.57995;
    
    //create search control
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load places automcomplete
    this.mapsApiLoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,{ types: ["address"]});

        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place : google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if(place.geometry === undefined || place.geometry === null){
              return;
            }

            //set latitude longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;
          });
        });
      }
    );
  }


  private setCurrentPosition(){
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        //for getting name
        // var geocoder = new google.maps.Geocoder();
        // var infowindow = new google.maps.InfoWindow();
        // var latlng = new google.maps.LatLng(this.latitude,this.longitude);
        // var mapOptions = {
        //   zoom: this.zoom,
        //   center: latlng
        // };
        // var map = new google.maps.Map(,mapOptions); 
      })
    }
  }

  onChooseLocation(event){
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;
    //alert("Latitude: " + this.latitude + " Longitude: " +  this.longitude);
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(this.latitude,this.longitude);
    geocoder.geocode({ 'location' : latlng }, function(results,status){
      if(status == google.maps.GeocoderStatus.OK){
        if(results[1]){
          //console.log(results[1].formatted_address);
          alert(results[1].formatted_address + "Latitude: " + this.latitude + " Longitude: " +  this.longitude);
        }
        else{
          //console.log("Location not found");
          alert("Location Not found");
        }
      }
      else{
        //console.log("Geocoder failed due to : " + status);
        alert("Geocoder failed due to : " + status);
      }
    });
  }
}
