"use client";

import { useEffect } from "react";

interface Props {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  useEffect(() => {
    let scanner: any;

    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");

      scanner = new Html5Qrcode("reader");

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText: string) => {
          onScan(decodedText);
          scanner.stop();
        },
        () => {}
      );
    }

    startScanner().catch(console.error);

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div
      id="reader"
      className="w-full rounded-xl overflow-hidden border border-white/10"
    />
  );
}