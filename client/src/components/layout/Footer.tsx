export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="page-shell py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-1">
            <span className="font-display text-lg font-bold text-gold">
              Leon
            </span>
            <span className="font-display text-lg font-light text-muted-foreground">
              Real Estate
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Leon Real Estate. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
