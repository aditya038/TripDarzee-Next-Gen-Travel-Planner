import { useState } from 'react';
import Logo from '../../assets/logo.png'
import { Button } from '../ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";

function Header() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [openDailog, setOpenDailog] = useState(false);

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDailog(false);
        })
    }

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    })

    const openModal = () => {
        if (!user) {
            setOpenDailog(true);
            return;
        }
    }

    return (
        <div className='p-2 shadow-sm flex justify-between items-center px-24'>
            <a href="/"><img className='py-2 h-16' src={Logo} alt="header logo" /></a>
            <div className="">
                {user ?
                    <div className='flex gap-3'>
                        <a href="/create-trip">
                            <Button variant="outline" className="rounded-full">
                                + Create Trip
                            </Button>
                        </a>
                        <a href="/my-trips">
                            <Button variant="outline" className="rounded-full">My Trips</Button>
                        </a>
                        <Popover>
                            <PopoverTrigger>
                                <img src={user.picture} alt="user logo" className='w-[35px] h-[35px] rounded-full' />
                            </PopoverTrigger>
                            <PopoverContent className="w-44">
                                <h2 className='cursor-pointer px-2 hover:scale-105 transition-all' onClick={() => {
                                    googleLogout();
                                    localStorage.clear();
                                    window.location.reload();
                                }}>Logout</h2>
                            </PopoverContent>
                        </Popover>

                    </div>
                    :
                    <Button onClick={openModal}>Sign In</Button>
                }
            </div>
            <Dialog open={openDailog} onOpenChange={setOpenDailog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><img className='py-2 w-36' src={Logo} alt="Logo" /> </DialogTitle>
                        <DialogDescription>
                            <div>
                                <h2 className="font-bold text-lg mb-3">Sign In With Google</h2>
                                <p className="mb-3">Sign in to the App with Google authentication securely</p>
                            </div>

                            <Button onClick={login} className="w-full gap-2 mt-5 flex items-center">
                                <FcGoogle className="w-7 h-7" />
                                Sign In With Google
                            </Button>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header