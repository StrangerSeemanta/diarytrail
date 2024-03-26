import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
function Nopage({ isButtonDisabled }: { isButtonDisabled?: boolean }) {
    const navigate = useNavigate()
    return (
        <React.Fragment>
            <main className="grid min-h-[90vh] place-items-center  px-6 py-24 sm:py-32 lg:px-8" >
                <div className="text-center">
                    <p className="text-base font-semibold text-primary-400">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground-900 sm:text-5xl">Page not found</h1>
                    <p className="mt-6 text-base leading-7 text-foreground-400">Sorry, we couldn’t find the page you’re looking for.</p>
                    {!isButtonDisabled &&
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button
                                colorScheme=''
                                className='bg-diaryAccent hover:brightness-90 active:brightness-110'
                                variant='solid'
                                onClick={() => { navigate(-1) }}
                            >
                                Go back
                            </Button>
                            <Button
                                variant='outline'
                                color='default'
                                onClick={() => { navigate("/") }}
                                rightIcon={<span >&rarr;</span>} >
                                Home
                            </Button>
                        </div>}
                </div>
            </main>

        </React.Fragment>
    )
}

export default Nopage