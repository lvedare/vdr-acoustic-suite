
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const ChatWhatsapp = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat WhatsApp</CardTitle>
        <CardDescription>
          Integração com WhatsApp será implementada com Z-API ou Twilio.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-[500px] items-center justify-center">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            Integração com WhatsApp
          </h3>
          <p className="mt-2 text-muted-foreground">
            A integração com a API do WhatsApp Business será implementada em breve.
          </p>
          <Button className="mt-4 bg-vdr-blue hover:bg-blue-800">
            Configurar Integração
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWhatsapp;
