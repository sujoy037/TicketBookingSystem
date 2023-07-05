import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { axiosInstance } from '../helpers/axiosInstance';
import { Col, Row, message } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from '../components/SeatSelection';
import StripeCheckout from 'react-stripe-checkout';

const BookNow = () => {
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([])
  const param = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const getBus = async () => {

    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: param.id
      });
      // const response = await axios.post("/api/buses/get-all-buses", {},
      // {
      //     headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      // })
      console.log(response.data)
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getBus();
  }, []);

  const bookNow = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,

      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  return (
    <div>
      {bus && (
        <Row className='mt-3' gutter={[30,30]}>
          <Col lg={12} sm={24} xs={24}>
            <h1 className="text-2xl primary-text"><b>{bus.name}</b></h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />
            <div className="flex flex-col gap-2">
              <p className="text-md">
                Jourey Date : {bus.journeyDate}
              </p>
              <p className="text-md">
                Fare :{bus.fare} /-
              </p>
              <p className="text-md">
                Departure Time : {bus.departure}
              </p>
              <p className="text-md">
                Arrival Time : {bus.arrival}
              </p>
              <p className="text-md">
                Capacity : {bus.capacity}
              </p>
              <p className="text-md">
                Seats Left : {bus.capacity - bus.seatsBooked.length}
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <h1 className='text-2xl mt-3'>
                <b>Selected Seats</b>:{selectedSeats.join(",")}
              </h1>
              <h1 className='text-lg'>
                Fare :<b> ${bus.fare * selectedSeats.length}</b>
              </h1>
              <StripeCheckout
                billingAddress
                amount={bus.fare * selectedSeats.length * 100}
                currency="INR"
                token={onToken}
                stripeKey="pk_test_51NPs0kSAH1AhBnPTkkkM86GDj68kZNFpj1DbublN0uQfRNLMjbcn46VpnNUonaKqrCeXyfUSGpwwvMIDOSm3MfUO00jOnSH8gs"
              >
                <button className={`secondary-btn mt-3 ${selectedSeats.length === 0 && "disabled-btn"
                  }`} disabled={selectedSeats.length === 0}>Book Now</button>
              </StripeCheckout>


            </div>
          </Col>
          <Col lg={12} sm={24} xs={24} >
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  )
}

export default BookNow