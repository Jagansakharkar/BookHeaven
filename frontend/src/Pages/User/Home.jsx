import React, { lazy } from 'react'
// Home Page Sections
import { Hero } from "../../Components/Layout/Home/Hero";
import { RecentlyAdded } from '../../Components/Layout/Home/RecentlyAdded';
import { FeaturesSection } from "../../Components/Layout/Home/FeaturesSection";
import { CategoriesSection } from "../../Components/Layout/Home/CategoriesSection";

const Home = () => {
  return (
    <div className='min-h-screen bg-zinc-900 text-white px-10 py-8'>
      <Hero />
      <CategoriesSection />
      <FeaturesSection />
      {/* <RecentlyAdded /> */}
    </div>
  )
}
export default Home
