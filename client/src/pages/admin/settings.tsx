import React from 'react';
import SideBarAdmin from '@/components/common/SideBarAdmin';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"

const AdminSettings = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <SideBarAdmin />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Settings</h1>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your site general settings here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" placeholder="Enter site name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input id="adminEmail" type="email" placeholder="Enter admin email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="GMT">GMT</SelectItem>
                        <SelectItem value="EST">EST</SelectItem>
                        <SelectItem value="PST">PST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default AdminSettings;