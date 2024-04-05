import { Avatar, Box, Center, HStack, Heading, IconButton, Input, InputGroup, InputLeftAddon, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text, Tooltip, useToast } from "@chakra-ui/react";
import { FormEvent, Fragment, ReactNode, useState, } from "react"
import { IconType } from "react-icons";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
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

            <HStack justifyContent={"space-between"} flexWrap={"wrap"}>
                <MobileSidebar />
                <div className="h-[15vh] py-7 px-2  flex justify-end items-center">
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
                            <IconButton onClick={() => navigate("messages")} size={"sm"} variant={"ghost"} isRound aria-label="conversation-drawer">
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
                                    <MenuItem as={Link} to={"/profile"}>My Profile</MenuItem>
                                    <MenuItem as={Link} to={"/settings"}>Account Settings </MenuItem>

                                </MenuGroup>
                                <MenuDivider />
                                <MenuGroup title='Help' color={"darkblue"}>
                                    <MenuItem as={Link} to={"/supports"}>Help & Supports</MenuItem>
                                    <MenuItem as={Link} to={"/policies"}>Privacy & Policies</MenuItem>

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
            </HStack>
            <div className="w-full min-h-[85vh] bg-diaryLightBlue flex px-2 ">

                <div className={twMerge("min-h-screen relative flex-1 overflow-y-auto py-2")}>
                    {/* Top Nav */}

                    <div className="h-fit w-full bg-transparent overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default Sidebar