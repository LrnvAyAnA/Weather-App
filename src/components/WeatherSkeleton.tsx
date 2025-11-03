import React from "react";
import '../styles/WeatherSkeleton.css'



export default function WeatherSkeleton() {
return (
       <div className="weather-card skeleton">
      <div className="current-weather">
        <div style={{display:"flex", width:'160px', flexDirection:'column', gap:'5px', alignSelf:'flex-start'}}>
        <div className="city-name shimmer" style={{ width: "83px", height: "49px" }} />
        <div className="city-name shimmer" style={{ width: "180px", height: "35px" }}/>
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', alignItems:'center',paddingTop:'35px'}}>
          <div style={{display:"flex", flexDirection:'row', gap:'10px'}}>
        <div className="temp shimmer" style={{ width: "100px", height: "100px", borderRadius:'50px' }} />
        <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
          <div className="temp shimmer" style={{ width: "100px", height: "70px" }} />
          <div className="temp shimmer" style={{ width: "100px", height: "35px" }} />
        </div>
        </div>
        <div style={{display:'flex', flexDirection:"column", gap:'5px'}}>
          <div style={{display:'flex', flexDirection:'row', gap:"5px", alignItems:'center'}}>
          <div className="shimmer" style={{width: "30px", height: "30px", borderRadius:'50px'}}/>
          <div className="shimmer" style={{width: "100px", height: "20px", borderRadius:'10px'}}/>
        </div>
        <div style={{display:'flex', flexDirection:'row', gap:"5px", alignItems:'center'}}>
          <div className="shimmer" style={{width: "30px", height: "30px", borderRadius:'50px'}}/>
          <div className="shimmer" style={{width: "100px", height: "20px", borderRadius:'10px'}}/>
        </div>
        </div>
        </div>
        {/* <div className="description shimmer" style={{ width: "100px", height: "18px" }} /> */}
      </div>

      <div className="forecast-list">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="forecast-card shimmer"/>
        ))}
      </div>
    </div>
  )
}