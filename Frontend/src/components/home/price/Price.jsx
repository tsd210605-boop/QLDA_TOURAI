import React from "react"
import Heading from "../../common/Heading"
import "./price.css"
import PriceCard from "./PriceCard"

const Price = () => {
  return (
    <>
      <section className='price padding'>
        <div className='container'>
          <Heading title='Christmas Offers' subtitle='Celebrate the festive season in Sri Lanka with our specially curated Christmas packages! Enjoy relaxing stays at beautiful resorts, festive meals, guided sightseeing, and fun activities for the whole family. Make your holidays memorable with exclusive Christmas offers and discounts.' />
          <PriceCard />
        </div>
      </section>
    </>
  )
}

export default Price
