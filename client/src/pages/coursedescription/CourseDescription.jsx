import React, { useEffect, useState } from 'react'
import './coursedescription.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import axios from 'axios';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/Loading';


const CourseDescription = ({ user }) => {
    const params = useParams();
    const { fetchCourse, course, fetchCourses } = CourseData();
    const [loading, setLoading] = useState(false);
    const { fetchUser } = UserData();

    const navigate = useNavigate();
    useEffect(() => {
        fetchCourse(params.id);
    }, []);

    const checkoutHandler = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);

        const {
            data: { order },
        } = await axios.post(`${server}/api/course/checkout/${params.id}`,
            {},
            {
                headers: {
                    token,
                },
            }
        );


        const options = {
            key: "rzp_test_IEJgHGyUY17gAs", // Enter the Key ID generated from the Dashboard
            amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "E-Learning", //your business name
            description: "Learning",
            // "image": "https://example.com/your_logo",
            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: async function (res) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = res;
                try {
                    const { data } = await axios.post(`${server}/api/verification/${params.id}`,
                        {
                            razorpay_order_id, razorpay_payment_id, razorpay_signature
                        },
                        {
                            headers: {
                                token,
                            },
                        }
                    );
                    await fetchUser();
                    await fetchCourses();
                    toast.success(data.message);
                    setLoading(false);
                    navigate(`/payment-success/${razorpay_payment_id}`);
                } catch (error) {
                    toast.error(error.response.data.message);
                    setLoading(false);
                }
            },
            theme: {
                color: "#8a4baf",
            },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }

    return (
        <>
            {
                loading ? (<Loading />) :
                    (<>
                        {course &&
                            (<div className='course-description'>
                                <div className="course-header">
                                    <img src={`${server}/${course.image}`} alt="" className='course-image' />
                                    <div className="course-info">
                                        <h2>{course.title}</h2>
                                        <p>Instructor: {course.createdBy}</p>
                                        <p>Duration: {course.duration} Weeks</p>
                                    </div>

                                </div>
                                <p>{course.description}</p>

                                <p>Let's get Started at just ₹{course.price}</p>

                                {
                                    user && user.subscription.includes(course._id) ?
                                        (<button className='common-btn' onClick={() => navigate(`/course/study/${course._id}`)}>Study</button>)
                                        : (<button onClick={checkoutHandler} className='common-btn'>Buy Now</button>)
                                }

                            </div>
                            )}
                    </>)
            }
        </>
    )
}
export default CourseDescription
