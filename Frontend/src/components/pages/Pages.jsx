// Khai báo các route React công khai và chuyển khu vực quản trị qua AdminRoute.

import React from "react";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Public Pages
import Home from "../home/Home";
import About from "../about/About";
import Destinations from "../destinations/Destinations";
import Pricing from "../pricing/Pricing";
import Blog from "../blog/Blog";
import Services from "../services/Services";
import Contact from "../contact/Contact";
import PackagesList from "../packages/PackagesList";
import PackageDetails from "../packages/PackageDetails";
import Bookings from "../bookings/Bookings";
import PackageBookingForm from "../bookings/PackageBookingForm";
import EditBooking from "../bookings/EditBooking";
import Recent from "../home/recent/Recent";
import Login from "../auth/Login";
import Register from "../auth/Register";

// Admin Pages
import AdminDashboard from "../admin/AdminDashboard";
import AdminLogin from "../admin/AdminLogin";
import AdminRoute from "../admin/AdminRoute";

/** Dựng định tuyến cấp ứng dụng, gồm trang điểm đến, danh sách tour và chi tiết theo ID. */
const Pages = () => {
    return (
        <Router>
            <Switch>

                <Route exact path="/admin/login" component={AdminLogin} />

                <Route path="/admin">
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                </Route>

                <Route>
                    <Header />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/about' component={About} />
                        <Route exact path='/services' component={Services} />
                        <Route exact path='/blog' component={Blog} />
                        <Route exact path='/pricing' component={Pricing} />
                        <Route exact path='/destinations' component={Destinations} />

                        <Route exact path='/packages' component={PackagesList} />
                        <Route path='/packages/:id' component={PackageDetails} />

                        <Route exact path='/bookings' component={Bookings} />
                        <Route path='/bookings/package/:id' component={PackageBookingForm} />
                        <Route path='/edit-booking/:id' component={EditBooking} />

                        <Route exact path='/login' component={Login} />
                        <Route exact path='/register' component={Register} />

                        <Route exact path='/recent' component={Recent} />
                        <Route exact path='/offers' component={Pricing} />
                        <Route exact path='/contact' component={Contact} />
                    </Switch>
                    <Footer />
                </Route>

            </Switch>
        </Router>
    );
};

export default Pages;
