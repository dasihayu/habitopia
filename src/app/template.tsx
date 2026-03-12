import PageTransitionWrapper from "@/components/ui/PageTransitionWrapper";

export default function Template({ children }: { children: React.ReactNode }) {
    return <PageTransitionWrapper>{children}</PageTransitionWrapper>;
}
