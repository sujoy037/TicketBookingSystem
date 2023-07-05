import React, { useEffect, useState, useRef } from 'react'
import PageTitle from '../components/PageTitle'
import BusForm from '../components/BusForm';
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { axiosInstance } from '../helpers/axiosInstance';
import { Modal, Table, message } from 'antd';
import axios from 'axios';
import moment from "moment";
import { useReactToPrint } from 'react-to-print';

const Bookings = () => {
  const dispatch = useDispatch()
  const [bookings, setbookings] = useState([])
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const getBookings = async () => {

    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/get-bookings-by-user-id", {});
      // const response = await axios.post("/api/buses/get-all-buses", {},
      // {
      //     headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      // })
      console.log(response.data)
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setbookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };



  useEffect(() => {
    getBookings();
  }, []);

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => {
        return seats.join(", ");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}

          >
            Print Ticekt
          </p>
        </div>
      ),
    },


  ]
  return (
    <div>
      <PageTitle title='booking' />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>


      {showPrintModal &&
        <Modal title='Print Ticket' onCancel={() => {
          setShowPrintModal(false)
          setSelectedBooking(null)
        }} visible={showPrintModal} okText="Print"
          onOk={handlePrint}>

          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>Bus : {selectedBooking.name}</p>
            <p>
              {selectedBooking.from} - {selectedBooking.to}
            </p>
            <hr />
            <p>
              <span>Journey Date:</span>{" "}
              {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBooking.departure}
            </p>
            <hr />
            <p>
              <span>Seat Numbers:</span> <br />
              {selectedBooking.seats}
            </p>
            <hr />
            <p>
              <span>Total Amount:</span>{" "}
              {selectedBooking.fare * selectedBooking.seats.length} /-
            </p>
          </div>

        </Modal>}
    </div>
  )
}

export default Bookings