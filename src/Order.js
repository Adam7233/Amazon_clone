import React from 'react'
import  './Orders.css';
import { useStateValue } from './StateProvider';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {Link} from 'react-router-dom'
function Order() {
    const [{user}] = useStateValue();
    return (
        <div className='orders'>
            <h1>Thank you for your order</h1>
            <div className='orders_info'>
           <CheckCircleIcon className='orders_check' />
            <p>Your order has been successfully placed!</p>
            </div>
            {user ? <div>A confirmation email has been sent to : <strong>{user?.email}</strong> </div> :''}
            
            <Link to='/' className='orders_button'>
            <button>Continue Shopping</button>
            </Link>
        </div>
    )
}

export default Order
