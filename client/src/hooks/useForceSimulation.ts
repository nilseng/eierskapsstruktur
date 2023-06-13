import { D3DragEvent, Simulation, drag, forceCollide, forceLink, forceSimulation, select } from "d3";
import { cloneDeep } from "lodash";
import { RefObject, useEffect } from "react";
import { graphConfig } from "../components/Graph2/GraphConfig";
import { GraphLink, GraphNode, GraphType } from "../models/models";
import { GraphLinkDatum, GraphNodeDatum } from "../slices/graphSlice";

const nodeOffset = {
  x: graphConfig.nodeDimensions.width / 2,
  y: graphConfig.nodeDimensions.height / 2,
};

export const useForceSimulation = ({
  nodes,
  links,
  source,
  target,
  graphType,
  svgRef,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
  source?: GraphNode;
  target?: GraphNode;
  graphType: GraphType;
  svgRef: RefObject<SVGSVGElement>;
}) => {
  useEffect(() => {
    if (svgRef.current && nodes.length > 0 && source) {
      const svg = select(svgRef.current);

      const mutableNodes: GraphNodeDatum[] = cloneDeep(nodes).map((node) => ({
        id: node.properties.uuid,
        x: 0,
        y: 0,
        ...node,
      }));

      if (source) {
        fixSourcePosition({ node: mutableNodes.find((n) => n.properties.uuid === source.properties.uuid)!, graphType });
      }
      if (target) {
        fixTargetPosition({ node: mutableNodes.find((n) => n.properties.uuid === target.properties.uuid)!, graphType });
      }

      const mutableLinks: GraphLinkDatum[] = links.map((link) => ({
        ...link,
        source: mutableNodes.find((node) => node.id === (link.source as GraphNodeDatum).properties.uuid)!,
        target: mutableNodes.find((node) => node.id === (link.target as GraphNodeDatum).properties.uuid)!,
      }));

      const link = svg.selectAll("line").data(mutableLinks).join("line");

      const simulation = forceSimulation<GraphNodeDatum, GraphLinkDatum>(mutableNodes)
        .alpha(0.4)
        .force(
          "link",
          forceLink<GraphNodeDatum, GraphLinkDatum>(mutableLinks).id(
            ({ id }) => mutableNodes.find((node) => node.id === id) as any
          )
        )
        .force(
          "collide",
          forceCollide(Math.max(graphConfig.nodeDimensions.width / 2, graphConfig.nodeDimensions.height / 2))
        );

      const node = svg
        .selectAll<SVGForeignObjectElement, GraphNodeDatum>("foreignObject")
        .data(mutableNodes)
        .join("foreignObject")
        .call(handleDrag(simulation));

      simulation.on("tick", () => {
        node.attr("x", (n) => n.x! - nodeOffset.x).attr("y", (n) => n.y! - nodeOffset.y);
        link
          .attr("x1", (l) => (l.source as GraphNodeDatum).x!)
          .attr("y1", (l) => (l.source as GraphNodeDatum).y!)
          .attr("x2", (l) => (l.target as GraphNodeDatum).x!)
          .attr("y2", (l) => (l.target as GraphNodeDatum).y!);
      });
    }
  }, [nodes, links, source, graphType, target, svgRef]);
};

const fixSourcePosition = ({ node, graphType }: { node: GraphNodeDatum; graphType: GraphType }) => {
  if (graphType === GraphType.Default) {
    node.fx = 0;
    node.fy = 0;
  }
  if (graphType === GraphType.ShortestPath) {
    node.fx = -(graphConfig.width / 2 - nodeOffset.x);
    node.fy = -(graphConfig.height / 2 - nodeOffset.y);
  }
  if (graphType === GraphType.AllPaths) {
    node.fx = 0;
    node.fy = -(graphConfig.height / 2 - nodeOffset.y);
  }
};

const fixTargetPosition = ({ node, graphType }: { node: GraphNodeDatum; graphType: GraphType }) => {
  if (graphType === GraphType.ShortestPath) {
    node.fx = graphConfig.width / 2 - nodeOffset.x;
    node.fy = graphConfig.height / 2 - nodeOffset.y;
  }
  if (graphType === GraphType.AllPaths) {
    node.fx = 0;
    node.fy = graphConfig.height / 2 + nodeOffset.y;
  }
};

const handleDrag = (simulation: Simulation<GraphNodeDatum, GraphLinkDatum>) => {
  function dragstarted(event: D3DragEvent<HTMLElement, any, any>) {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: D3DragEvent<HTMLElement, any, any>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: D3DragEvent<HTMLElement, any, any>) {
    if (!event.active) simulation.alphaTarget(0);
  }

  return drag<SVGForeignObjectElement, GraphNodeDatum>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};