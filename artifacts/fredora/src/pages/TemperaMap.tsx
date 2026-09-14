import { useEffect } from "react";
import { useLocation } from "wouter";

export default function TemperaMap() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/temperamap");
  }, [setLocation]);

  return null;
}

