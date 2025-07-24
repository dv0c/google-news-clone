import { Button } from "./ui/button"

const Footer = () => {
    return <footer className="mt-10 p-6 text-center space-y-3">
        <h1 className="text-xl text-blue-400">Δείτε περισσότερες ειδήσεις με βάση τα ενδιαφέροντά σας</h1>
        <Button className="rounded-full text-black hover:bg-blue-300 font-semibold bg-blue-400">Για εσάς</Button>
    </footer>
}

export default Footer