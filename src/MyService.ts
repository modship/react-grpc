import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { PublicServiceClient } from "./gen/massa/api/v1/public.client";
import { ExecutionEventFilter, GetStatusRequest, GetStatusResponse, NewSlotExecutionOutputsFilter, NewSlotExecutionOutputsRequest, NewSlotExecutionOutputsResponse } from "./gen/massa/api/v1/public";
import { Observable } from "rxjs";

export class MyService {

    private readonly public_client: PublicServiceClient;
    constructor(url: string) {
        let transport = new GrpcWebFetchTransport({
            baseUrl: url
        });
        this.public_client = new PublicServiceClient(transport);
    }


    getStatus(): Promise<GetStatusResponse> {
        return new Promise((resolve, reject) => {
            let r = this.public_client.getStatus(GetStatusRequest, {}).then((r: any) => {
                resolve(r.response);
            }, (err: any) => {
                console.error(err);
                reject(err);
            });
        });
    }

    newSlots(): Observable<NewSlotExecutionOutputsResponse> {
        return new Observable<NewSlotExecutionOutputsResponse>((observer) => {
            let filters: NewSlotExecutionOutputsFilter[] = [];
            const emitterAddressFilter: ExecutionEventFilter = {
                filter: {
                    oneofKind: "emitterAddress",
                    emitterAddress: "AS12QPPvCWSYhqKvh6Fw21tSZSsghiRExNEaDgDYNcUzznYCtihgX"
                }
            };
            // const callerAddressFilter: ExecutionEventFilter = {
            //     filter: {
            //         oneofKind: "callerAddress",
            //         callerAddress: "exampleCallerAddress"
            //     }
            // };

            filters.push({
                filter: {
                    oneofKind: "eventFilter",
                    eventFilter: emitterAddressFilter
                }
            });

            let server_stream = this.public_client.newSlotExecutionOutputsServer({ filters: filters }, {});

            server_stream.responses.onMessage((response) => {
                if (response.output &&
                    response.output.executionOutput &&
                    response.output.executionOutput.events &&
                    response.output.executionOutput.events.length > 0) {
                    observer.next(response);
                }
            });

            server_stream.responses.onError((error) => {
                observer.error(error);
                observer.complete();
            });

            server_stream.responses.onComplete(() => {
                observer.complete();
            });
        });
    }
}