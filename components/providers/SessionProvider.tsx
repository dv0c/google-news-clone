'use client'
import { SessionProvider as SP } from 'next-auth/react'
import { FC } from 'react'

interface SessionProviderProps {
    children: React.ReactNode
}

const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
    return <SP>
        {children}
    </SP>
}

export default SessionProvider
