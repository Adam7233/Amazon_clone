import React ,{ useState,useEffect } from 'react'
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from './StateProvider'
import {Link,useHistory} from 'react-router-dom';
import { CardElement,useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import {db} from './Firebase';
function Payment() {
    const [{basket,user},dispatch] = useStateValue();
    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();
    const [error,setError] = useState(null);
    const [disabled,setDisabled] = useState(true);
    const [succeeded,setSucceeded] = useState(null);
    const [processing,Setprocessing] = useState(false);
    const [clientSecret,setClientSecret] = useState(true);



    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer

        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret();
    }, [basket])

    console.log('THE SECRET IS >>>', clientSecret)
    
    const handleSubmit = async (e)=>{
       e.preventDefault();
       Setprocessing(true);

       const payload = await stripe.confirmCardPayment(clientSecret,{
           payment_method : {
               card: elements.getElement(CardElement)
           }
       }).then(({paymentIntent}) =>{

        db
        .collection('users')
        .doc(user?.id)
        .collection('orders')
        .doc(paymentIntent.id)
        .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created

        })
           
           setSucceeded(true)
           setError(null)
           Setprocessing(false)
           dispatch({
               type:'EMPTY_BASKET'
           })
           history.replace('/orders')

       })


      }

    const handleChange = (e)=>{
       setDisabled(e.empty);
       setError(e.error ? e.error.message : '');
    }
    return (
        <div className='payment'>
            <div className="payment_container">
                <h1>
                    checkout (
                        <Link to='/checkout'>{basket.length} items</Link>
                    )
                </h1>
              <div className="payment_section">
                <div className="payment_title">
                    <h3>Delivery Address</h3>
                </div>
                <div className="payment_address">
                    <p>{user?.email}</p>
                    <p>123 React lane</p>
                    <p>Los Angeles,CA</p>
                </div>
              </div>
              <div className="payment_section">
                <div className="payment_title">
                    <h3>Review items and delivery</h3>
                </div>
                <div className="payment_items">
                    {
                     basket.map((item)=>{
                         return(
                       <CheckoutProduct 
                       id={item.id}
                       title={item.title}
                       image={item.image}
                       price={item.price}
                       rating={item.rating}
                       />)
                     })
                    }
                </div>
              </div>
              <div className="payment_section">
                <div className="payment_title">
                    <h3>payment method</h3>
                </div>
                <div className="payment_details">
                   { /* stripe  */}
                   <form onSubmit={handleSubmit}>
                     <CardElement onChange={handleChange} />
                     <div className="payment_priceContainer">
                     <CurrencyFormat
                            renderText={(value) => (
                                <h3>Order Total: {value}</h3>
                            )}
                            decimalScale={2}
                            value={getBasketTotal(basket)} 
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                        />
                        <button disabled={processing || disabled || succeeded}>
                        <span>{processing ? <p>processing</p> : 'Buy now'}</span>
                        </button>
                        
                     </div>
                     {error && <div>{error}</div>}
                   </form>
                </div>
              </div>
            </div>
        </div>
    )
}

export default Payment
