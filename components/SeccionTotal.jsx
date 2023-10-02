import { useRouter } from 'next/navigation'
import { formatearDinero } from '../helpers'

const SeccionTotal = ({ cant, total, envio, carrito, textoBtn, btn }) => {
    const router = useRouter()
    return (
        <div className='flex flex-col w-full md:w-2/6 px-4'>
            <h2 className="text-5xl text-blue-950 text-center">Proceder con el pago</h2>
            <div className='bg-white text-start gap-2 rounded-xl flex flex-col mt-5 p-5'>
                <div className='flex flex-col font-bold'>
                    <p>Cantidad de productos:</p>
                    <p className='text-amber-500 text-4xl'>{cant} productos</p>
                </div>

                

                {envio ? (
                    <>
                        <div className='flex flex-col md:flex-row gap-2 pb-2'>
                            <div className='flex flex-col font-bold w-full md:w-1/2'>
                                <p>Subtotal: </p>
                                <p className='text-amber-500 text-4xl'>{formatearDinero(total)}</p>
                            </div>

                            <div className='flex flex-col font-bold w-full md:w-1/2'>
                                <p>Envio: </p>
                                <p className='text-amber-500 text-4xl'>+{formatearDinero(envio)}</p>
                            </div>
                        </div>

                        <div className='flex flex-col font-bold border-t-2 pt-2'>
                            <p>Total: </p>
                            <p className='text-blue-900 text-4xl'>{formatearDinero(envio + total)}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='flex flex-col font-bold w-full'>
                            <p>Subtotal: </p>
                            <p className='text-amber-500 text-4xl'>{formatearDinero(total)}</p>
                        </div>
                    </>
                )}

                {btn && (
                    <button 
                        onClick={() => router.push('/comprar')}
                        className={`${carrito.length <= 0 ? 'bg-indigo-100 text-indigo-500' : 'bg-amber-500 text-white hover:bg-amber-600'} mt-10  font-bold px-5 py-2 rounded-md`} 
                        disabled={carrito.length <= 0}
                    >
                        {textoBtn}
                    </button>
                )}
            </div>  
        </div>
    )
}

export default SeccionTotal
