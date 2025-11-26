export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/20 py-8 mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-primary font-medium text-lg" data-testid="text-footer-credit">
            Created by Farhankertadiwangsa
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            © 2025 KynayStreams. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
