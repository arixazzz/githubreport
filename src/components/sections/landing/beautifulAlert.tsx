"use client";

import { useMyAlertDialog } from "@/components/shared/customAlertDialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BeautifulAlert() {
  const alert = useMyAlertDialog();
  const { close } = useMyAlertDialog();

  const handleShowInfo = () => {
    alert.show({
      type: "info",
      title: "Informasi",
      description:
        "Ini adalah contoh dialog informasi dengan color scheme default.",
    });
  };

  const handleShowSuccess = () => {
    alert.show({
      type: "success",
      title: "Berhasil! 🎉",
      description: "Aksi Anda telah berhasil dilakukan dengan sempurna.",
    });
  };

  const handleShowError = () => {
    alert.show({
      type: "error",
      title: "Terjadi Kesalahan",
      description: "Ups! Ada yang tidak beres. Silakan coba lagi.",
    });
  };

  const handleShowConfirm = async () => {
    const result = await alert.show({
      type: "confirm",
      title: "Konfirmasi Tindakan",
      description: "Apakah Anda yakin ingin melanjutkan tindakan ini?",
      confirmLabel: "Ya, Lanjut",
    });
    console.log("User confirmed:", result);
  };

  const handleShowConfirmWithInput = async () => {
    const { show } = useMyAlertDialog.getState();
    const result = await show({
      type: "confirm",
      title: "Alasan Penghapusan",
      description: "Tolong tuliskan alasan Anda menghapus data ini.",
      confirmLabel: "Kirim",
      inputPlaceholder: "Tulis alasan di sini...",
    });
    if (result !== false) {
      console.log("Alasan dari user:", result);
    }
  };

  const handleShowLoading = () => {
    alert.show({
      type: "loading",
      title: "Memproses...",
      description:
        "Mohon tunggu sebentar, kami sedang memproses permintaan Anda.",
    });

    setTimeout(() => {
      close();
      setTimeout(() => {
        alert.show({
          type: "success",
          title: "Selesai!",
          description: "Proses telah berhasil diselesaikan.",
        });
      }, 300);
    }, 3000);
  };

  // Custom color scheme examples
  const handleShowCustomPurple = () => {
    alert.show({
      type: "success",
      title: "Custom Purple Theme!",
      description: "Ini menggunakan tema purple custom yang cantik.",
      colorScheme: {
        header: "bg-purple-600",
        icon: "bg-purple-600",
        iconBg: "bg-purple-100",
        iconRing: "border-purple-300",
        buttonBg: "bg-purple-600 hover:bg-purple-700",
      },
    });
  };

  const handleShowSuccessWithWarningColor = () => {
    alert.show({
      type: "success",
      title: "Success dengan Warning Color",
      description:
        "Dialog success tapi menggunakan color scheme warning (amber).",
      colorScheme: "warning",
    });
  };

  const handleShowErrorWithNeutral = () => {
    alert.show({
      type: "confirm",
      title: "Error dengan Neutral Color",
      description: "Dialog error tapi menggunakan color scheme neutral (gray).",
      colorScheme: "neutral",
    });
  };

  const handleShowConfirmWithInfo = () => {
    alert.show({
      type: "confirm",
      title: "Confirm dengan Info Color",
      description: "Dialog confirm tapi menggunakan color scheme info (blue).",
      colorScheme: "info",
      confirmLabel: "Ya, Setuju",
    });
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full space-y-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
        >
          Beautiful Alert Dialog
        </motion.h1>

        {/* Default Dialog Types */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Default Dialog Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                onClick: handleShowInfo,
                variant: "outline",
                text: "Show Info Dialog",
                color: "hover:border-blue-400 hover:text-blue-600",
              },
              {
                onClick: handleShowSuccess,
                className: "bg-green-500 hover:bg-green-600 text-white",
                text: "Show Success Dialog",
              },
              {
                onClick: handleShowError,
                className: "bg-red-500 hover:bg-red-600 text-white",
                text: "Show Error Dialog",
              },
              {
                onClick: handleShowConfirm,
                className: "bg-amber-500 hover:bg-amber-600 text-white",
                text: "Show Confirm Dialog",
              },
              {
                onClick: handleShowConfirmWithInput,
                className: "bg-indigo-500 hover:bg-indigo-600 text-white",
                text: "Show Confirm With Input",
              },
              {
                onClick: handleShowLoading,
                className: "bg-blue-500 hover:bg-blue-600 text-white",
                text: "Show Loading Dialog",
              },
            ].map((button, index) => (
              <motion.div
                key={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Button
                  onClick={button.onClick}
                  variant={button.variant as any}
                  className={`w-full py-3 font-medium shadow-lg transition-all duration-200 ${
                    button.className || ""
                  } ${button.color || ""}`}
                >
                  {button.text}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Color Scheme Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, staggerChildren: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Custom Color Schemes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                onClick: handleShowCustomPurple,
                className: "bg-purple-500 hover:bg-purple-600 text-white",
                text: "Custom Purple Theme",
              },
              {
                onClick: handleShowSuccessWithWarningColor,
                className:
                  "bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white",
                text: "Success + Warning Color",
              },
              {
                onClick: handleShowErrorWithNeutral,
                className:
                  "bg-gradient-to-r from-red-500 to-gray-500 hover:from-red-600 hover:to-gray-600 text-white",
                text: "Error + Neutral Color",
              },
              {
                onClick: handleShowConfirmWithInfo,
                className:
                  "bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-white",
                text: "Confirm + Info Color",
              },
            ].map((button, index) => (
              <motion.div
                key={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <Button
                  onClick={button.onClick}
                  className={`w-full py-3 font-medium shadow-lg transition-all duration-200 ${button.className}`}
                >
                  {button.text}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Color Scheme Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Available Color Schemes:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>error</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span>warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span>neutral</span>
            </div>
          </div>
          <p className="text-gray-600 mt-3 text-sm">
            Anda dapat menggunakan predefined color schemes atau membuat custom
            color scheme sendiri!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
