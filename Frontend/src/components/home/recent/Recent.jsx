import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Our Packages' subtitle='Discover the best of Sri Lanka with packages designed for every type of traveler. Enjoy nature and adventure with scenic treks, waterfalls, and camping under the stars. Immerse yourself in the island’s rich cultural and historical heritage, visiting ancient cities, temples, etc... Experience vibrant city life and culinary delights, or unwind with beach and relaxation packages, including snorkeling, luxury resorts, and romantic sunset cruises. Each package is crafted to give you unforgettable memories at affordable prices.' />
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Recent
