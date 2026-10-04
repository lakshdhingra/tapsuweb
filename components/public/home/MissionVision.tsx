"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { motion } from "framer-motion";

export function MissionVision() {
  return (
    <section className="bg-primary text-white py-24 lg:py-32 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <Container className="relative z-10">
        <div className="mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-white/70">
            Our Purpose
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <h2 className="font-heading text-4xl font-bold">Mission</h2>
            </div>
            {/* Animated Gold Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="h-px bg-[#D4AF37]"
            />
            <p className="text-xl md:text-2xl font-heading leading-relaxed text-white/90">
              To unite authorized service centre proprietors, advocate for fair industry practices, and provide a collaborative platform that fosters growth, mutual support, and professional excellence.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <h2 className="font-heading text-4xl font-bold">Vision</h2>
            </div>
            {/* Animated Gold Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="h-px bg-[#D4AF37]"
            />
            <p className="text-xl md:text-2xl font-heading leading-relaxed text-white/90">
              To be the most trusted and influential collective voice for service centres in Telangana, ensuring a thriving ecosystem for proprietors, brands, and consumers alike.
            </p>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
