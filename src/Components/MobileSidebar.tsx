import {
    Drawer,
    DrawerBody,
    HStack, Box, IconButton, Heading,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack, useDisclosure,
} from '@chakra-ui/react';
import { Link } from "react-router-dom";

import Logo from "../assets/favicon.png"

import { AiOutlineMenu } from "react-icons/ai";
import { getSidebarLinks } from '../Modules/SidebarLinks';
import { SidebarItemButton } from './Sidebar';

function MobileSidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <HStack display={"inline-flex"} height={'10vh'} py={3} px={5} justifyContent={"start"} alignItems={"center"} >
                <Box mr={2} className="flex items-center gap-3 ">
                    <IconButton aria-label="toggle-menu" variant={"ghost"} onClick={onOpen}>
                        <AiOutlineMenu size={24} />
                    </IconButton>
                    <Heading as={Link} to={"/"} size={"xl"} fontFamily={`"Clicker Script", 'cursive'`} fontWeight={700} className=" text-transparent bg-gradient-to-r from-black to-diaryAccentText  bg-clip-text">
                        Diary Trail
                    </Heading>
                    <Drawer
                        isOpen={isOpen}
                        placement='left'
                        onClose={onClose}

                    >
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader className="flex justify-start gap-3 items-center">
                                <Box className="w-8 lg:w-10 ">
                                    <img className="select-none " src={Logo} />
                                </Box>
                                <Heading as={Link} to={"/"} size={"xl"} fontFamily={`"Clicker Script", 'cursive'`} fontWeight={700} className=" text-transparent bg-gradient-to-r from-black to-diaryAccentText  bg-clip-text">
                                    Diary Trail
                                </Heading></DrawerHeader>

                            <DrawerBody className="cscroll">
                                <div className="w-full min-h-[85vh] overflow-y-auto cscroll  shadow-none rounded-md bg-transparent py-4  ">
                                    <VStack>
                                        {
                                            getSidebarLinks(location.pathname).map((props, keys) => (
                                                <SidebarItemButton key={String(keys) + props.Label} idx={keys} {...props} />
                                            ))
                                        }

                                    </VStack>


                                </div>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Box>
            </HStack>

        </>)
}

export default MobileSidebar