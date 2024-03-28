import { Avatar, Box, Center, Divider, HStack, Heading, IconButton, Input, InputGroup, InputLeftAddon, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text, Tooltip, VStack, useToast } from "@chakra-ui/react";
import Logo from "../assets/favicon.png"
import { FormEvent, Fragment, ReactNode, useState, } from "react"
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { getSidebarLinks } from "../Modules/SidebarLinks";
import { Link } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import { BiSearch } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";
import { User, getAuth, signOut } from "firebase/auth";
import { LuLogOut } from "react-icons/lu";
export interface SidebarItemButtonProps {
    idx: number;
    Icon: IconType;
    Label: string;
    To: string;
    isActive: boolean;
}
export function SidebarItemButton({ idx, Label, Icon, To, isActive }: SidebarItemButtonProps) {
    const navigateTo = useNavigate();
    return (
        <>
            <Box width={"100%"} height={"72px"} bgColor={"transparent"} py={1} px={4}>
                <HStack cursor={"pointer"} onClick={() => navigateTo(To)} justifyContent={"start"} alignItems={"center"} height={"100%"} rounded={"0.5rem"} sx={{ animationDelay: `${idx * 150}ms` }} className={twMerge("group animate-on-sidebar whitespace-nowrap transition-all duration-500", isActive ? "bg-white shadow-customized" : "bg-transparent ")}>
                    <Box sx={{ animationDelay: `${idx * 150}ms` }} className={twMerge(" animate-popup _icon-wrapper flex justify-center items-center  p-3 rounded-lg w-9 h-9 mr-1", isActive ? "bg-gradient-to-bl from-blue-600 to-diaryHiddenText" : "bg-gradient-to-bl from-pink-200 to-white shadow-lg shadow-gray-500/30")}>
                        <Center>
                            <Icon size={20} className={twMerge(isActive ? "text-white" : "text-diaryHiddenText")} />
                        </Center>
                    </Box>
                    <Text className={twMerge(" font-diaryQuickSand font-bold capitalize", isActive ? "text-diaryAccentText " : "group-hover:text-diaryHiddenText transition-colors duration-200 text-diaryHiddenText/60")}>
                        {Label}
                    </Text>
                </HStack>
            </Box>
        </>
    )
}
interface SidebarProps {
    children: ReactNode;
    currentUser: User;
}
function Sidebar({ children, currentUser }: SidebarProps) {
    const location = useLocation();
    const [searchVal, setSearchVal] = useState<string | number | readonly string[] | undefined>();
    const navigate = useNavigate();
    const toast = useToast();
    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
    }
    const handleLogout = () => {
        const auth = getAuth();
        const signoutPromise = signOut(auth);
        signoutPromise.then(() => navigate("/login"))
        toast.promise(signoutPromise, {
            loading: {
                title: "Logging Out",
                description: "Please wait...",
                isClosable: false,
                position: "bottom-right"
            },
            success: {
                title: "Successfully Logged Out",
                description: "You have logged out from Diarytrail ",
                isClosable: false,
                position: "bottom-right"
            },
            error: {
                title: "Failed To Log Out",
                description: "Something Error Occured! Try again.",
                isClosable: false,
                position: "bottom-right"
            }
        })
    }
    return (

        <Fragment>

            <MobileSidebar />
            <div className="w-full min-h-[85vh] bg-diaryLightBlue flex px-2 ">
                <div className="w-56 h-[85vh] overflow-y-auto cscroll  shadow-none rounded-md bg-transparent py-4 hidden lg:block">
                    <HStack data-aos="zoom-in" px={3} py={4}>
                        <Box className="w-8 ">
                            <img className="select-none " src={Logo} />
                        </Box>
                        <Heading as={Link} to={"/"} size={"lg"} fontFamily={`"Clicker Script", 'cursive'`} fontWeight={700} className=" text-transparent bg-gradient-to-r from-black to-diaryAccentText  bg-clip-text">
                            Diary Trail
                        </Heading>

                    </HStack>

                    <Box px={5} mb={3}>
                        <Divider borderBottom={"2px solid coral"} />

                    </Box>
                    <VStack>
                        {
                            getSidebarLinks(location.pathname).map((props, keys) => (
                                <SidebarItemButton key={String(keys) + props.Label} idx={keys} {...props} />
                            ))
                        }

                    </VStack>


                </div>
                <div className={twMerge("min-h-screen relative flex-1 overflow-y-auto py-2")}>
                    {/* Top Nav */}
                    <div className="h-[15vh] py-7 px-2 w-full flex justify-end items-center">
                        <div className="p-2 w-fit h-fit bg-white shadow-customized rounded-full flex gap-2 justify-start items-center">
                            <form onSubmit={handleSearch} method="GET">
                                <InputGroup isTruncated bgColor={"rgb(244, 247, 254)"} borderRadius={"9999px"}>
                                    <InputLeftAddon border={"none"}>
                                        <BiSearch className="text-gray-800/50" />
                                    </InputLeftAddon>
                                    <Input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} name="dtsearch" id="dtsearch" type="search" aria-label="dtsearch-bar" variant={"filled"} sx={{ border: "none" }} placeholder="Search..." />
                                </InputGroup>
                            </form>
                            <Tooltip label="Notifiactions" placement="top" hasArrow>
                                <IconButton size={"sm"} variant={"ghost"} isRound aria-label="notifiaction-drawer">
                                    <IoMdNotificationsOutline size={21} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip label="conversations" placement="top" hasArrow>
                                <IconButton size={"sm"} variant={"ghost"} isRound aria-label="conversation-drawer">
                                    <BsChatDots size={19} />
                                </IconButton>
                            </Tooltip>

                            <Menu >
                                <MenuButton as={IconButton} size={"md"} variant={"ghost"} isRound aria-label="userpopover-drawer">
                                    <Avatar size={"sm"} name={currentUser.displayName || undefined} src={currentUser.photoURL || undefined} />

                                </MenuButton>
                                <MenuList className="">
                                    <Box px={3} py={2} mb={4}>
                                        <HStack alignItems={"center"}>
                                            <Avatar size={"sm"} name={currentUser.displayName || undefined} src={currentUser.photoURL || undefined} />
                                            <Box>
                                                <Heading size={"md"} as={"h2"} fontSize={17}>{currentUser.displayName}</Heading>
                                                <Text size={"sm"} fontSize={14}>{currentUser.email}</Text>

                                            </Box>
                                        </HStack>
                                    </Box>
                                    <MenuGroup title='Account' color={"darkblue"}>
                                        <MenuItem>My Profile</MenuItem>
                                        <MenuItem>Account Settings </MenuItem>

                                    </MenuGroup>
                                    <MenuDivider />
                                    <MenuGroup title='Help' color={"darkblue"}>
                                        <MenuItem>Help & Supports</MenuItem>
                                        <MenuItem>Privacy & Policies</MenuItem>
                                        <MenuItem>About <span className="mx-1 font-semibold">Diary Trail</span></MenuItem>

                                    </MenuGroup>
                                    <MenuDivider />
                                    <MenuGroup title='Manage' color={"darkblue"}>
                                        <MenuItem onClick={handleLogout} justifyContent={"center"} width={"90%"} mx={"auto"} _hover={{ filter: "brightness(0.9)" }} _active={{ filter: "brightness(1)" }} bgColor={"coral"} color={"white"}>
                                            <span className="mr-3 text-diaryPrimaryText font-bold">Logout</span>
                                            <LuLogOut className="text-diaryPrimaryText" />
                                        </MenuItem>
                                    </MenuGroup>
                                </MenuList>
                            </Menu>
                        </div>
                    </div>
                    <div className="h-fit w-full bg-transparent overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default Sidebar