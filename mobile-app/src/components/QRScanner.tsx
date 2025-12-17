import { useEffect, useRef, useState } from 'react';
// @ts-ignore - html5-qrcode doesn't have types
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  onScanSuccess: () => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannerRunning, setScannerRunning] = useState(false);
  const successHandledRef = useRef(false);
  const scannerId = 'qr-scanner';

  const stopScannerSafely = async () => {
    if (scannerRef.current && scannerRunning) {
      try {
        await scannerRef.current.stop();
      } catch (err: any) {
        // Ignore stop errors - scanner might already be stopped or not running
        // Common errors: "Cannot stop, scanner is not running" - we can ignore these
        if (!err?.message?.includes('not running') && !err?.message?.includes('not started')) {
          console.log('Scanner stop error:', err);
        }
      } finally {
        setScannerRunning(false);
        setIsScanning(false);
      }
    } else {
      // Scanner never started, just update state
      setScannerRunning(false);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' }, // Use back camera on mobile
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // QR code scanned successfully
            if (mounted && !successHandledRef.current) {
              successHandledRef.current = true;
              handleScanSuccess();
            }
          },
          (errorMessage) => {
            // Ignore scanning errors (they're frequent during scanning)
          }
        );

        if (mounted) {
          setIsScanning(true);
          setScannerRunning(true);
        }
      } catch (err) {
        console.error('Error starting scanner:', err);
        // If camera fails, still allow bypass
        if (mounted) {
          setIsScanning(false);
          setScannerRunning(false);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      stopScannerSafely();
    };
  }, []);

  const handleScanSuccess = async () => {
    if (successHandledRef.current) return;
    successHandledRef.current = true;
    
    await stopScannerSafely();
    setShowSuccess(true);
    
    // Auto-close after showing success
    setTimeout(() => {
      onScanSuccess();
      onClose();
    }, 2000);
  };

  const handleBypass = async () => {
    if (successHandledRef.current) return;
    successHandledRef.current = true;
    
    // Stop scanner if running, but proceed regardless
    await stopScannerSafely();
    // Directly show success without waiting for scanner
    setShowSuccess(true);
    
    setTimeout(() => {
      onScanSuccess();
      onClose();
    }, 2000);
  };

  const handleClose = async () => {
    await stopScannerSafely();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <h3 className="text-white font-semibold">Scan Kiosk QR Code</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Scanner View */}
      <div className="flex-1 flex items-center justify-center relative">
        <div id={scannerId} className="w-full max-w-md" />
        
        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-primary rounded-lg w-64 h-64 relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 px-4 text-center">
          <p className="text-white/80 text-sm">
            Point your camera at the QR code on the kiosk screen
          </p>
        </div>
      </div>

      {/* Bypass Button */}
      <div className="p-4 bg-black/50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBypass}
          className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          Test Sync (Bypass)
        </Button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-background rounded-2xl p-8 max-w-sm mx-4 text-center shadow-elevated"
            >
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Sync Successful!</h3>
              <p className="text-muted-foreground">
                Your cart has been synced from the kiosk. Continue shopping on the kiosk.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

