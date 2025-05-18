import React, { useEffect, useState } from 'react'
import './coursedescription.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import axios from 'axios';


const CourseDescription = ({user}) => {
    const params = useParams();
    const { fetchCourse, course } = CourseData();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        fetchCourse(params.id);
    }, []);

    const checkoutHandler = async() =>{
        const token = localStorage.getItem('token');
        setLoading(true);

        const {
            data: {order},
        } = await axios.post(`${server}/api/course/checkout/${params.id}`);
    }
        
    return (
        <>
            {course &&
                (<div className='course-description'>
                    <div className="course-header">
                        <img src={`${server}/${course.image}`} alt="" className='course-image'/>
                        <div className="course-info">
                            <h2>{course.title}</h2>
                            <p>Instructor: {course.createdBy}</p>
                            <p>Duration: {course.duration} Weeks</p>
                        </div>
                        
                    </div>
                    <p>Let's get Started at just ₹{course.price}</p>

                        {
                            user && user.subscription.includes(course._id)?
                            (<button className='common-btn' onClick={()=>navigate(`/course/study/${course._id}`)}>Study</button>)
                            :(<button onClick={checkoutHandler} className='common-btn'>Buy Now</button>)
                        }

                </div>
                )}
        </>
    )
}
export default CourseDescription
