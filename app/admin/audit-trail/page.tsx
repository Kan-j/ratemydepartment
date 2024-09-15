import React from 'react'
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FilterComponent from '@/components/AuditTrail/FilterComponent'
import { Button } from '@/components/ui/button'
import { fetchAuditTrailLogs } from '@/lib/actions'
import AuditTrailPagination from '@/components/shared/AuditTrailPagination'
import { parseISO, subDays } from 'date-fns'
import AuditTrailDownladButton from '@/components/forms/AuditTrailDownladButton'

interface Props {
  searchParams: { [key: string]: string | undefined }
}

const AuditTrailPage = async({searchParams}: Props) => {
  const page = parseInt(searchParams['page'] || '1')
  const dateFrom = searchParams['dateFrom'] ? parseISO(searchParams['dateFrom']) : subDays(new Date(), 2);
  const dateTo = searchParams['dateTo'] ? parseISO(searchParams['dateTo']) : new Date();
  const actionTypes = searchParams['actionTypes']
  ? Array.isArray(searchParams['actionTypes'])
    ? searchParams['actionTypes'] // Already an array
    : searchParams['actionTypes'].split(',') // Split by commas if it's a single string
  : [];

// Similarly, you can do this for models as well:
const models = searchParams['models']
  ? Array.isArray(searchParams['models'])
    ? searchParams['models']
    : searchParams['models'].split(',')
  : [];
  // const actionTypes = (searchParams['actionTypes'] || [])
  // const models = (searchParams['models'] || [])
  const {logs, currentPage, totalPages}  = await fetchAuditTrailLogs({page, pageSize: 50, startDate:dateFrom, endDate:dateTo, actionType:actionTypes,models:models })



  return (
    <section className='flex flex-col'>
        <section className="">
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">Audit Trail</h1>
            <p className="text-gray-800">Monitor any changes done to the platform</p>

            <section className="mt-5 bg-blue-50 px-5 py-3 rounded-md">
              <FilterComponent/>
            </section>

            <section className="mt-5 flex justify-end w-full">
              <AuditTrailDownladButton auditTrailData={logs}/>
            </section>

            <section className="mt-5 flex flex-col gap-2">
              <Table>
                  <TableHeader >
                    <TableRow>
                      <TableHead className="text-gray-800 font-semibold">Name</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Email</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Action</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Model</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Timestamp</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {logs.map((auditTrail: any, index) => {
                    // Parse actionDetails JSON
                    let actionDetailsParsed: Record<string, any> = {};

                    try {
                      actionDetailsParsed = JSON.parse(auditTrail.actionDetails);
                    } catch (error) {
                      console.error('Error parsing actionDetails:', error);
                    }

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-gray-700">
                          {auditTrail.userName}
                        </TableCell>
                        <TableCell className="text-gray-700">{auditTrail.userEmail}</TableCell>
                        <TableCell className="text-gray-700">{auditTrail.actionType}</TableCell>
                        <TableCell className="text-gray-700">{auditTrail.model}</TableCell>
                        <TableCell className="text-gray-700">
                          {new Date(auditTrail.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                          })}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline">View Query Details</Button>
                            </SheetTrigger>
                            <SheetContent style={{ maxHeight: '100vh', overflowY: 'auto' }} >
                              <SheetHeader>
                                <SheetTitle>Query Details</SheetTitle>
                              </SheetHeader>

                              <div className="py-4 text-gray-900">
                                <div className="mb-4">
                                  <Label className="text-right font-semibold">Model:</Label>
                                  <p className='font-bold text-gray-900'>{auditTrail.model}</p>
                                </div>


                                  {actionDetailsParsed.data && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Data:</Label>
                                      <pre className="bg-gray-100 p-2 rounded">
                                        {JSON.stringify(actionDetailsParsed.data, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {actionDetailsParsed.where && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Where Clause:</Label>
                                      <pre className="bg-gray-100 p-2 rounded">
                                        {JSON.stringify(actionDetailsParsed.where, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {actionDetailsParsed.include && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Include:</Label>
                                      <pre className="bg-gray-100 p-2 rounded">
                                        {JSON.stringify(actionDetailsParsed.include, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {actionDetailsParsed.select && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Select Fields:</Label>
                                      <pre className="bg-gray-100 p-2 rounded">
                                        {JSON.stringify(actionDetailsParsed.select, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {actionDetailsParsed.orderBy && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Order By:</Label>
                                      <pre className="bg-gray-100 p-2 rounded">
                                        {JSON.stringify(actionDetailsParsed.orderBy, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {actionDetailsParsed.distinct && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Distinct:</Label>
                                      <pre className="bg-gray-100 p-2 rounded">
                                        {JSON.stringify(actionDetailsParsed.distinct, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {actionDetailsParsed.take && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Limit:</Label>
                                      <p>{actionDetailsParsed.take}</p>
                                    </div>
                                  )}

                                  {actionDetailsParsed.skip && (
                                    <div className="mb-4">
                                      <Label className="text-right font-semibold">Offset:</Label>
                                      <p>{actionDetailsParsed.skip}</p>
                                    </div>
                                  )}
                              </div>

                              <SheetFooter>
                                <SheetClose asChild>
                                  <Button type="submit">Close</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
                <AuditTrailPagination currentPage={currentPage} totalPages={totalPages}/>
            </section>
        </section>
    </section>
  )
}

export default AuditTrailPage